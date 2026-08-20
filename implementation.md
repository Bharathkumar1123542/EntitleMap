# EntitleMap — Implementation Plan

**Document version:** 1.0
**Companion documents:** `project_overview.md`, `architecture.md`

---

## 1. Repository Structure

```
entitlemap/
├── agents/
│   ├── orchestrator/
│   │   ├── agent.py
│   │   └── prompts/orchestrator_system_prompt.md
│   ├── intake/
│   │   ├── agent.py
│   │   └── prompts/intake_system_prompt.md
│   ├── eligibility_matching/
│   │   ├── agent.py           # thin ADK wrapper
│   │   └── rules_engine.py    # deterministic predicate evaluator (no LLM)
│   ├── claim_status/
│   │   ├── agent.py
│   │   └── claim_ledger_client.py
│   ├── document_generation/
│   │   ├── agent.py
│   │   ├── pdf_builder.py
│   │   └── prompts/summary_generation_prompt.md
│   └── delivery/
│       └── agent.py
├── services/
│   ├── whatsapp_webhook/
│   │   ├── main.py             # FastAPI app, Cloud Run entrypoint
│   │   └── signature_verify.py
│   └── claim_ledger_mock/
│       └── main.py             # mock service implementing ClaimLedgerService interface
├── data/
│   ├── schemes/                # one JSON file per scheme (EligibilityRule + ApplicationTemplate)
│   │   ├── pm_kisan.json
│   │   ├── ...
│   └── templates/               # PDF/HTML application templates per scheme
├── ingestion/
│   ├── extract_scheme.py       # Gemini structured extraction script
│   ├── review_queue.py         # CLI tool to approve/reject extracted rules
│   └── schema/eligibility_rule.schema.json
├── models/
│   ├── citizen_profile.py
│   ├── eligibility_rule.py
│   ├── application_package.py
│   └── conversation_session.py
├── infra/
│   ├── deploy.sh
│   ├── cloudrun.orchestrator.yaml
│   ├── cloudrun.webhook.yaml
│   └── firestore.indexes.json
├── tests/
│   ├── test_rules_engine.py
│   ├── test_intake_validation.py
│   ├── fixtures/synthetic_profiles.json
│   └── fixtures/expected_matches.json
├── requirements.txt
└── README.md
```

---

## 2. Phased Build Plan

### Phase 0 — Project Setup (½ day)
1. Create Google Cloud project, enable APIs: Vertex AI, Cloud Run, Firestore, Cloud Storage, Pub/Sub.
2. Set up WhatsApp Business Cloud API sandbox app in Meta Developer Console; note `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`.
3. Initialize repo with the structure in §1. Set up `requirements.txt` with: `google-adk`, `google-cloud-firestore`, `google-cloud-storage`, `google-cloud-pubsub`, `fastapi`, `uvicorn`, `weasyprint`, `jinja2`, `pydantic`.
4. Configure a service account with roles: `roles/datastore.user`, `roles/storage.objectAdmin`, `roles/pubsub.editor`, `roles/aiplatform.user`.
5. **Exit criterion:** `curl` to a "hello world" Cloud Run service succeeds; Firestore is reachable from a local script using the service account.

### Phase 1 — Data Model and Rules Engine (1 day)
1. Implement `models/*.py` as Pydantic models matching the schemas in `architecture.md` §4.
2. Implement `agents/eligibility_matching/rules_engine.py`:
   - Function signature: `evaluate(rule: EligibilityRule, profile: CitizenProfile) -> MatchResult`, where `MatchResult = {matched: bool, matched_conditions: list[str]}`.
   - Support operators: `==`, `!=`, `>=`, `<=`, `>`, `<`, `in`, `not_in`, combined via top-level `AND`/`OR`.
3. Write `tests/test_rules_engine.py` covering: single-condition match, multi-condition AND, multi-condition OR, boundary values (e.g., `age == 60` exactly), missing-field handling (must fail closed, i.e., treat as `not matched` and log a warning, never raise unhandled).
4. **Exit criterion:** 100% of unit tests pass; rules engine has zero external dependencies (no network calls), confirmed by a test that runs with network access disabled.

### Phase 2 — Scheme Data Curation (1–1.5 days, can run in parallel with Phase 1)
1. Select 25–40 real schemes across ≥ 4 categories (income support, disability, agriculture, housing, education — pull from official sources such as state welfare department portals and `myscheme.gov.in` listings, one PDF/notification per scheme).
2. For each scheme, run `ingestion/extract_scheme.py <scheme_pdf_or_url>`:
   - Calls Gemini with a schema-constrained prompt (see §5) to produce a draft `EligibilityRule` + `ApplicationTemplate` JSON.
   - Output written to `data/schemes/<scheme_id>.draft.json` with `status: PENDING_REVIEW`.
3. Manually review each draft against the source document using `ingestion/review_queue.py approve <scheme_id>` or `reject <scheme_id> --reason "..."`. Approved files are renamed to `<scheme_id>.json` with `status: PUBLISHED`.
4. Load all `PUBLISHED` scheme files into Firestore collection `schemes` via a one-time `scripts/load_schemes_to_firestore.py` script.
5. **Exit criterion:** ≥ 25 schemes in Firestore with `status: PUBLISHED`, each traceable to a `source_document_url`.

### Phase 3 — Intake Agent and Conversation State Machine (1.5 days)
1. Implement `models/conversation_session.py` and Firestore read/write helpers (`get_session`, `save_session`) keyed by `citizen_id = sha256(phone_number)`.
2. Implement `agents/intake/agent.py` as an ADK `LlmAgent` with the system prompt in `prompts/intake_system_prompt.md` (see §5).
3. Implement slot-filling logic: iterate over the required `CitizenProfile` fields in a fixed order, ask one question per turn, validate the answer against the field's type/enum, and only mark `is_complete = true` once every field is filled.
4. **Exit criterion:** A scripted local conversation (no WhatsApp yet, plain stdin/stdout harness) reaches `is_complete = true` for a sample citizen in ≤ 10 turns.

### Phase 4 — WhatsApp Integration (1 day)
1. Implement `services/whatsapp_webhook/main.py`: `GET /webhook` for Meta's verification handshake (echoes `hub.challenge` if `hub.verify_token` matches `WHATSAPP_VERIFY_TOKEN`), `POST /webhook` for inbound messages.
2. Implement `signature_verify.py` to validate the `X-Hub-Signature-256` header against `WHATSAPP_APP_SECRET`.
3. Implement outbound send functions: `send_text_message`, `send_interactive_list` (for claim-confirmation batching), `send_document_message` (for PDF delivery).
4. Wire inbound messages to publish to Pub/Sub topic `entitlemap.inbound`; Orchestrator Agent subscribes and processes.
5. **Exit criterion:** A real WhatsApp message sent to the sandbox number reaches the Orchestrator and a reply is received back on the phone.

### Phase 5 — Orchestrator, Eligibility Matching, and Claim-Status Wiring (1 day)
1. Implement `agents/orchestrator/agent.py`: phase state machine per `architecture.md` §3, dispatching to sub-agents registered as ADK tools.
2. Wire Eligibility Matching Agent to call `rules_engine.evaluate` against every `PUBLISHED` scheme in Firestore for the completed profile.
3. Implement `services/claim_ledger_mock/main.py`: a stub HTTP service implementing `GET /claim-status?citizen_id=&scheme_id=` returning `{"status": "unknown"}` by default (or a seeded fixed set of "already claiming" pairs for demo variety).
4. Implement Claim-Status Agent: for each matched scheme, call the mock ledger; if `unknown`, ask the citizen the self-declaration question via an interactive WhatsApp list.
5. **Exit criterion:** End-to-end conversation from profile completion through to a filtered `unclaimed_schemes` list, observable in Firestore.

### Phase 6 — Document Generation and Delivery (1.5 days)
1. Build one `ApplicationTemplate` (HTML/Jinja2) per curated scheme, with placeholders matching `field_mapping` in `architecture.md` §4.3.
2. Implement `pdf_builder.py`: render the Jinja2 template with the citizen profile → HTML → WeasyPrint → PDF, upload to Cloud Storage, return a signed URL or file reference.
3. Implement Document Generation Agent: call Gemini with `prompts/summary_generation_prompt.md` (see §5) to produce the plain-language summary in the citizen's language, assemble the checklist from `ApplicationTemplate.required_documents`, call `pdf_builder`.
4. Implement Delivery Agent: send summary text + checklist as a WhatsApp text message, send the PDF as a document message, and optionally assemble a consolidated multi-scheme report.
5. **Exit criterion:** A live WhatsApp conversation results in a received PDF for at least 2 different schemes in the same session.

### Phase 7 — Testing, Hardening, and Demo Prep (1 day)
1. Build `tests/fixtures/synthetic_profiles.json`: ≥ 10 synthetic citizen profiles covering different scheme-matching outcomes (including a "matches nothing" case).
2. Build `tests/fixtures/expected_matches.json` with hand-verified expected scheme matches per profile; assert 100% agreement (per `project_overview.md` §9).
3. Load-test with ≥ 20 concurrent simulated conversations against the deployed Cloud Run services; confirm no session cross-contamination (citizen A never sees citizen B's data).
4. Write the demo script (§8 below) and rehearse the full flow at least twice end-to-end on the real WhatsApp sandbox.
5. **Exit criterion:** Demo script runs clean, twice in a row, with no manual intervention.

---

## 3. Task Checklist (Condensed)

- [ ] Phase 0: GCP project, WhatsApp sandbox, repo skeleton, service account
- [ ] Phase 1: Data models, rules engine, unit tests
- [ ] Phase 2: 25–40 curated schemes in Firestore, source-traceable
- [ ] Phase 3: Intake Agent + conversation state machine, local test harness passing
- [ ] Phase 4: WhatsApp webhook (in/out), signature verification
- [ ] Phase 5: Orchestrator wiring, Eligibility Matching, Claim-Status + mock ledger
- [ ] Phase 6: Application templates, PDF builder, Document Generation + Delivery agents
- [ ] Phase 7: Synthetic test fixtures, load test, demo rehearsal

---

## 4. API / Interface Contracts

### 4.1 `ClaimLedgerService` interface (mocked now, real integration later)
```python
class ClaimLedgerService(Protocol):
    def get_claim_status(self, citizen_id: str, scheme_id: str) -> Literal["claiming", "not_claiming", "unknown"]:
        ...
```
The mock implementation (`services/claim_ledger_mock`) and any future real implementation must both satisfy this exact signature so the Claim-Status Agent never changes.

### 4.2 Rules engine
```python
def evaluate(rule: EligibilityRule, profile: CitizenProfile) -> MatchResult:
    """
    Returns MatchResult(matched: bool, matched_conditions: list[str]).
    Must not raise on missing profile fields — treat as unmatched and
    append a warning to matched_conditions prefixed with 'SKIPPED:'.
    Must have zero network/IO calls.
    """
```

### 4.3 WhatsApp outbound send functions
```python
def send_text_message(to: str, body: str) -> None: ...
def send_interactive_list(to: str, header: str, options: list[dict]) -> None: ...
def send_document_message(to: str, document_url: str, caption: str) -> None: ...
```

### 4.4 Pub/Sub message contract (`entitlemap.inbound` topic)
```json
{
  "citizen_id": "sha256 hash string",
  "raw_phone_number": "string (used only transiently for the reply, not persisted)",
  "message_type": "text | interactive_reply",
  "message_body": "string",
  "meta_message_id": "string (for idempotency)"
}
```

---

## 5. Agent Prompt Specifications

### 5.1 Orchestrator Agent — system prompt skeleton (`prompts/orchestrator_system_prompt.md`)
```
You are the EntitleMap Orchestrator. You manage a citizen's conversation
through these phases in strict order:
LANGUAGE_SELECT -> PROFILE_INTAKE -> MATCHING -> CLAIM_CONFIRMATION ->
DOCUMENT_GENERATION -> DELIVERY -> COMPLETE

Rules:
- Never skip a phase.
- Never ask the citizen for information already present in their CitizenProfile.
- On any sub-agent tool error, retry once; on a second failure, tell the
  citizen there was a temporary issue and that you will continue shortly.
- Never fabricate a scheme, eligibility result, or claim status — only use
  values returned by tool calls.
- All citizen-facing text must be in the citizen's selected language.
```

### 5.2 Intake Agent — system prompt skeleton (`prompts/intake_system_prompt.md`)
```
You collect exactly these CitizenProfile fields, one at a time, in this
order: language, age, gender, state, district, is_rural, occupation_category,
annual_income_band, social_category, has_disability,
disability_percentage (only if has_disability=true), land_owned_acres,
family_size.

For each field:
- Ask a short, plain-language question with an example valid answer.
- Validate the citizen's reply against the field's expected type/enum.
- If invalid, do not proceed — re-ask with a simpler rephrasing.
- Never ask about a field already present in the current CitizenProfile.
Output strictly as the tool-call schema provided — no free text outside it.
```

### 5.3 Document Generation Agent — summary prompt skeleton (`prompts/summary_generation_prompt.md`)
```
Given: scheme_name, scheme_category, matched_conditions (list of plain
predicate strings), citizen_language.

Write a 3-5 line, plain-language explanation, in citizen_language, covering:
1. What this scheme provides.
2. Why this citizen qualifies (reference matched_conditions in everyday
   language, not legal/technical terms).
3. One sentence noting this is a draft based on self-declared information
   and should be verified with the issuing department.

Do not invent any benefit amount, deadline, or condition not present in
the scheme's stored data.
```

### 5.4 Ingestion extraction prompt skeleton (`ingestion/extract_scheme.py` prompt)
```
Given the full text of a government scheme document, extract strictly the
following JSON schema (see ingestion/schema/eligibility_rule.schema.json):
scheme_name, category, jurisdiction, predicate (AND/OR tree of field/op/value
conditions restricted to the CitizenProfile field vocabulary), source
citations (page/section), required_documents list.

If a criterion in the document cannot be mapped to an existing
CitizenProfile field, output it under "unmappable_criteria" instead of
guessing a mapping. A human reviewer will resolve these before publish.
```

---

## 6. Testing Strategy

| Layer | Test type | Tooling |
|---|---|---|
| Rules engine | Unit tests, boundary-value tests, fuzz test on random profiles | `pytest` |
| Intake validation | Unit tests per field type/enum | `pytest` |
| End-to-end matching | Golden-file tests: fixed synthetic profiles → expected scheme matches | `pytest` + `tests/fixtures/*.json` |
| WhatsApp webhook | Signature verification unit test with known-good/known-bad signatures | `pytest` |
| Load/concurrency | ≥ 20 concurrent simulated sessions, assert no cross-session data leakage | Simple async load script (`locust` optional) |
| Demo rehearsal | Manual, scripted, on real WhatsApp sandbox, twice consecutively clean | Manual |

---

## 7. Deployment Steps

1. `gcloud auth login` and `gcloud config set project <PROJECT_ID>`.
2. Build and push container images:
   ```
   gcloud builds submit --tag gcr.io/<PROJECT_ID>/entitlemap-webhook services/whatsapp_webhook
   gcloud builds submit --tag gcr.io/<PROJECT_ID>/entitlemap-orchestrator agents/orchestrator
   gcloud builds submit --tag gcr.io/<PROJECT_ID>/entitlemap-claim-ledger-mock services/claim_ledger_mock
   ```
3. Deploy each Cloud Run service using the corresponding YAML in `infra/`, setting environment variables: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, `GOOGLE_CLOUD_PROJECT`, `FIRESTORE_DATABASE`, `PUBSUB_TOPIC_INBOUND`.
4. Set the deployed webhook URL as the Meta app's webhook callback URL and complete the verification handshake.
5. Apply Firestore indexes: `gcloud firestore indexes create --file infra/firestore.indexes.json`.
6. Run `scripts/load_schemes_to_firestore.py` once against the target environment to seed the `schemes` collection.
7. Smoke-test: send a WhatsApp message from a real phone to the sandbox number and confirm a reply.

---

## 8. Demo Script (Judging Walkthrough)

1. **Open with the problem (30 sec):** State the entitlement gap in one sentence — citizens don't know what they don't know.
2. **Live conversation (2–3 min):** From a phone, message the WhatsApp sandbox number as a synthetic citizen persona (e.g., a 62-year-old farmer with a disability certificate). Walk through language selection and profile questions live.
3. **Reveal the matches (30 sec):** Show the system surfacing 2–3 schemes the persona qualifies for, without having asked about any of them by name — this is the "push not pull" moment, call it out explicitly.
4. **Claim confirmation (30 sec):** Answer the self-declaration questions; show one scheme get filtered out as already claimed.
5. **Show the output (1 min):** Open the delivered WhatsApp PDF — a filled application draft plus checklist — and the plain-language summary message.
6. **Show the extensibility story (1 min):** Open `ingestion/extract_scheme.py`, run it live (or show a pre-recorded run) against a new scheme PDF, and show the human-review step producing a new `EligibilityRule` — proving the path from 25 schemes to 500+ without re-architecture.
7. **Close (30 sec):** Restate the novelty hook and the explicit, honest scope boundaries (self-declared profile instead of Aadhaar, mock claim ledger instead of DBT API) as a roadmap, not a gap.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| WhatsApp Business API sandbox approval delay | Medium | High (blocks live demo) | Apply for sandbox access on Day 0; have a local CLI conversation harness as a fallback demo path |
| Gemini-extracted eligibility rules contain subtle errors | Medium | High (wrong scheme matches undermine trust) | Mandatory human review step before any rule reaches `PUBLISHED` status; never skip this even under time pressure |
| PDF generation library rendering issues on Cloud Run | Low-Medium | Medium | Test WeasyPrint rendering in the exact Cloud Run container image early (Phase 6, not at the end) |
| Scope creep toward real Aadhaar/DBT integration | Medium | High (derails timeline) | This document explicitly designates both as non-goals (`project_overview.md` §5); treat any pressure to add them mid-build as an explicit scope-change decision, not a default |
| Judges probe on data privacy | Medium | Medium | Have `architecture.md` §8 (Security and Privacy) ready to reference directly |

---

## 10. Definition of Done (Hackathon Submission)

- All Phase 0–7 exit criteria met.
- Demo script (§8) rehearsed twice, clean, on the real WhatsApp sandbox.
- `project_overview.md`, `architecture.md`, `implementation.md` included in the submission repo as-is.
- README includes setup instructions sufficient for a judge or teammate to run the system locally against the mock claim ledger without needing production credentials.

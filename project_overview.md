# EntitleMap — Project Overview

**Document version:** 1.0
**Status:** Draft for hackathon build (Theme: AI for Civic and Legal Empowerment — Civic Tech, Legal Access, Government Transparency)
**Owner:** Bharath Vankayala

---

## 1. One-Line Summary

EntitleMap is a conversational agent system that proactively tells a citizen which government welfare schemes they qualify for but have never claimed, and produces a ready-to-submit application package for each one.

---

## 2. Problem Statement

Citizens in India are entitled to a wide range of government schemes — welfare payments, subsidies, certificates, insurance, pensions — but a large share of eligible citizens never claim them. This happens for three compounding reasons:

1. **Discovery failure.** Scheme information is scattered across hundreds of central and state government PDFs, notices, and portals, each with different formats and update cycles. A citizen does not know a scheme exists unless they go looking for it.
2. **Interpretation failure.** Eligibility criteria are written in bureaucratic and legal language (income slabs, caste categories, land-holding thresholds, occupational classifications) that is hard to map onto a citizen's own life circumstances.
3. **Pull-only tooling.** Every existing digital solution (portals, chatbots, RTI tools) requires the citizen to already know what to ask. None of them work the other way: starting from the citizen and telling them what they are owed.

The result is a structural, invisible gap between entitlement and claim — citizens don't know what they don't know.

---

## 3. Target Users / Personas

| Persona | Description | Primary need |
|---|---|---|
| **Rural/semi-urban citizen (primary)** | Low-to-moderate digital literacy, uses WhatsApp on a basic smartphone, may be more comfortable speaking than typing, prefers a regional language | Wants to know, in plain language, "what am I owed and how do I get it" without reading any government document |
| **CSC (Common Service Centre) operator (secondary)** | Local intermediary who assists citizens with government paperwork for a fee | Wants a pre-filled, print-ready application package to reduce manual form-filling time per citizen |
| **NGO / civic-tech field worker (secondary)** | Runs outreach camps, bulk-processes many citizens' profiles | Wants to run EntitleMap for a group of citizens and get a batch of entitlement reports |

---

## 4. Goals (In Scope for Hackathon MVP)

- G1: Citizen submits a demographic profile via a conversational WhatsApp flow (text; voice-note transcription is a stretch goal, see §6).
- G2: System matches the profile against a curated knowledge base of welfare schemes and returns all schemes the citizen is eligible for.
- G3: System filters out schemes the citizen has already self-declared as claimed (see §7 — real-time DBT ledger lookup is out of scope; self-declaration is the MVP substitute).
- G4: For each unclaimed, eligible scheme, system generates: (a) a plain-language entitlement summary in the citizen's chosen language, (b) a document checklist, (c) a pre-filled application draft (PDF).
- G5: Output is deliverable as a WhatsApp message thread and a downloadable/printable PDF pack.
- G6: The scheme knowledge base is demonstrably extensible: a documented ingestion pipeline turns a new scheme PDF into a structured eligibility rule with human review, proving the path to 500+ schemes without requiring it to actually be built for the demo.

## 5. Non-Goals (Explicitly Out of Scope)

- **Aadhaar eKYC integration.** Direct Aadhaar verification requires UIDAI AUA/KUA empanelment, a legal and commercial process unavailable to a hackathon team. EntitleMap uses **self-declared profile data** instead. This is a first-class design decision, not an oversight — see `architecture.md` §7.
- **Real-time DBT (Direct Benefit Transfer) payment ledger integration.** No public API for this exists. The MVP uses a self-declaration question ("Are you already receiving X?") and a mocked ledger service for demo purposes.
- **Legally binding application submission.** EntitleMap prepares a draft application; a human (the citizen or a CSC operator) must review and physically/digitally submit it. EntitleMap does not submit on the citizen's behalf.
- **Automated legal advice.** EntitleMap explains eligibility rules as encoded from official sources; it does not adjudicate disputed or edge-case eligibility, and every output carries a "verify with the issuing department" disclaimer.
- **Full 500+ scheme coverage.** The demo ships with a curated subset (target: 25–40 schemes across 4–5 categories, see `implementation.md` §5). Full coverage is a documented post-hackathon roadmap item, not a demo requirement.
- **Voice-note transcription in regional languages** is a stretch goal (§6), not a committed MVP feature — MVP intake is WhatsApp text with language selection.

## 6. Stretch Goals (Only After G1–G6 Are Demo-Ready)

- S1: Voice-note intake via IVR or WhatsApp voice notes, transcribed via Speech-to-Text in regional languages.
- S2: Batch mode for NGO/CSC field workers to process a CSV of multiple citizen profiles at once.
- S3: A second, larger, LLM-assisted (not just human-reviewed) scheme ingestion pass to expand past the curated set.

---

## 7. Key Assumptions and Constraints

| # | Assumption/Constraint | Why it matters | Design consequence |
|---|---|---|---|
| A1 | No Aadhaar or government ID verification is available | Cannot verify citizen-provided facts against a government source of truth | Profile is self-declared; every generated document states "eligibility computed from self-declared data — final verification is the issuing department's responsibility" |
| A2 | No public DBT payment ledger API exists | Cannot determine with certainty whether a scheme is already claimed | Self-declaration question per matched scheme + a mocked `ClaimLedgerService` (interface designed to be swapped for a real integration later) |
| A3 | Scheme eligibility rules must come from official scheme documents (PDFs, notifications) | Accuracy and trust depend on source fidelity | Every rule in the knowledge base stores a `source_document_url` and `last_verified_date`; no rule ships without a traceable source |
| A4 | Hackathon timeline is short (days, not months) | Cannot build a production-grade legal NER model | Ingestion pipeline uses an LLM (Gemini) for structured extraction plus a **mandatory human review step**, not a fine-tuned NER model, for the MVP |
| A5 | Primary channel is WhatsApp | Matches user's stated mechanism and is the most realistic low-literacy-friendly channel available via free-tier APIs | WhatsApp Business Cloud API (Meta) is the intake/delivery channel; IVR is deferred to stretch goals |

---

## 8. End-to-End User Journey (Narrative)

1. Citizen messages the EntitleMap WhatsApp number (or scans a QR code at a CSC/NGO camp) and selects a language.
2. A conversational flow asks a short series of plain-language questions (age, location/district, occupation, approximate annual income band, land ownership, disability status, category/caste certificate status, family details) — never more than what's needed to run eligibility checks.
3. The system matches the profile against the scheme knowledge base and produces a candidate list of eligible schemes.
4. For each candidate scheme, the citizen is asked one yes/no self-declaration question: "Are you already receiving [scheme name]?" Schemes answered "yes" are filtered out.
5. For each remaining unclaimed + eligible scheme, EntitleMap generates and sends: a 3–5 line plain-language summary of what the scheme provides and why the citizen qualifies, a document checklist, and a link to a pre-filled PDF application draft.
6. The citizen (or the CSC operator assisting them) reviews, gathers the checklisted documents, and submits the draft through the appropriate official channel.
7. Optional: the citizen can request the full "entitlement report" as a single consolidated PDF covering all matched schemes.

---

## 9. Success Metrics (Demo/Judging Criteria)

| Metric | Target for hackathon demo |
|---|---|
| Time from profile submission to entitlement summary | < 15 seconds end-to-end for a single citizen |
| Number of demo-ready schemes in the knowledge base | ≥ 25, spanning at least 4 categories (e.g., income support, disability, agriculture, housing, education) |
| Accuracy of eligibility matches against a hand-verified test set of synthetic citizen profiles | 100% agreement on the test set (since rules are deterministic predicates, not model guesses) |
| End-to-end demo path | Live WhatsApp conversation → generated PDF application draft, shown to judges without manual intervention |
| Novelty demonstration | Judges can clearly see the "push not pull" framing: the system surfaces schemes the citizen did not ask about |

---

## 10. Glossary

| Term | Definition |
|---|---|
| **Scheme** | A specific government welfare programme (e.g., a pension, subsidy, or certificate) with defined eligibility rules and a defined application process |
| **Eligibility predicate** | A structured, machine-evaluable rule (e.g., `age >= 60 AND income_annual <= 200000 AND category IN [SC, ST]`) extracted from a scheme's official document |
| **Entitlement gap** | A scheme a citizen is eligible for but has not claimed |
| **CSC** | Common Service Centre — a government-authorized local access point where citizens get help with digital government services |
| **DBT** | Direct Benefit Transfer — the government mechanism for paying scheme benefits directly into a citizen's bank account |
| **Claim ledger** | A record of which schemes a citizen is already receiving benefits from (mocked in this project; see A2) |
| **Application package** | The bundle of outputs EntitleMap produces per matched scheme: summary, checklist, and pre-filled draft |

---

## 11. Related Documents

- `architecture.md` — system architecture, components, data model, integrations, and security design.
- `implementation.md` — phased build plan, folder structure, agent specifications, API contracts, and deployment steps.

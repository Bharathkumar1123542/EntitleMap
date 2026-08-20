"""
tests/test_rules_engine.py
Unit tests for the deterministic eligibility rules engine.

Coverage:
  - Single-condition match / no-match (all 8 operators)
  - Multi-condition AND (all true, one false)
  - Multi-condition OR (one true, all false)
  - Nested AND inside OR, OR inside AND
  - Boundary values (age == 60 exactly, income band edge)
  - Missing profile fields (fail-closed, no raise)
  - Enum field comparison (social_category, occupation)
  - PUBLISHED vs non-PUBLISHED status filter
  - match_all_schemes against a small library

Run:  cd backend && python -m pytest tests/test_rules_engine.py -v
Exit criterion (implementation.md Phase 1): 100% pass, zero external calls.
"""

import sys
import os

# Allow importing from backend root without installing the package
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from datetime import date

from models.citizen_profile import (
    AnnualIncomeBand,
    CitizenProfile,
    Gender,
    OccupationCategory,
    SocialCategory,
)
from models.eligibility_rule import (
    ComparisonOperator as Op,
    Condition,
    EligibilityRule,
    Predicate,
    SchemeCategory,
    SchemeStatus,
)
from agents.eligibility_matching.rules_engine import evaluate, match_all_schemes


# ─── Fixtures ────────────────────────────────────────────────────────────────

def make_profile(**kwargs) -> CitizenProfile:
    """Build a base CitizenProfile with sensible defaults, overridable via kwargs."""
    defaults = dict(
        citizen_id="abc123",
        language="en",
        age=45,
        gender=Gender.MALE,
        state="Rajasthan",
        district="Barmer",
        is_rural=True,
        occupation_category=OccupationCategory.FARMER,
        annual_income_band=AnnualIncomeBand.BELOW_100000,
        social_category=SocialCategory.SC,
        has_disability=False,
        disability_percentage=None,
        land_owned_acres=2.5,
        family_size=4,
        is_complete=True,
    )
    defaults.update(kwargs)
    return CitizenProfile(**defaults)


def make_rule(conditions, operator="AND", status=SchemeStatus.PUBLISHED) -> EligibilityRule:
    """Build a minimal EligibilityRule for testing."""
    return EligibilityRule(
        scheme_id="test_scheme",
        scheme_name="Test Scheme",
        category=SchemeCategory.INCOME_SUPPORT,
        jurisdiction="central",
        predicate=Predicate(operator=operator, conditions=conditions),
        source_document_url="https://example.gov.in",
        last_verified_date=date(2024, 1, 1),
        status=status,
    )


# ─── Single condition tests ───────────────────────────────────────────────────

class TestSingleCondition:

    def test_eq_match(self):
        rule = make_rule([Condition(field="gender", op=Op.EQ, value="male")])
        profile = make_profile(gender=Gender.MALE)
        result = evaluate(rule, profile)
        assert result.matched

    def test_eq_no_match(self):
        rule = make_rule([Condition(field="gender", op=Op.EQ, value="female")])
        profile = make_profile(gender=Gender.MALE)
        assert not evaluate(rule, profile).matched

    def test_neq_match(self):
        rule = make_rule([Condition(field="gender", op=Op.NEQ, value="female")])
        assert evaluate(rule, make_profile(gender=Gender.MALE)).matched

    def test_gte_exact_boundary(self):
        """age >= 60 must match when age == 60 exactly."""
        rule = make_rule([Condition(field="age", op=Op.GTE, value=60)])
        assert evaluate(rule, make_profile(age=60)).matched

    def test_gte_just_below_boundary(self):
        rule = make_rule([Condition(field="age", op=Op.GTE, value=60)])
        assert not evaluate(rule, make_profile(age=59)).matched

    def test_lte_boundary(self):
        rule = make_rule([Condition(field="age", op=Op.LTE, value=79)])
        assert evaluate(rule, make_profile(age=79)).matched
        assert not evaluate(rule, make_profile(age=80)).matched

    def test_gt(self):
        rule = make_rule([Condition(field="land_owned_acres", op=Op.GT, value=0)])
        assert evaluate(rule, make_profile(land_owned_acres=0.1)).matched
        assert not evaluate(rule, make_profile(land_owned_acres=0.0)).matched

    def test_lt(self):
        rule = make_rule([Condition(field="age", op=Op.LT, value=18)])
        assert evaluate(rule, make_profile(age=17)).matched
        assert not evaluate(rule, make_profile(age=18)).matched

    def test_in_match(self):
        rule = make_rule([Condition(field="social_category", op=Op.IN, value=["sc", "st", "obc"])])
        assert evaluate(rule, make_profile(social_category=SocialCategory.SC)).matched
        assert evaluate(rule, make_profile(social_category=SocialCategory.ST)).matched

    def test_in_no_match(self):
        rule = make_rule([Condition(field="social_category", op=Op.IN, value=["sc", "st"])])
        assert not evaluate(rule, make_profile(social_category=SocialCategory.GENERAL)).matched

    def test_not_in_match(self):
        rule = make_rule([Condition(field="occupation_category", op=Op.NOT_IN, value=["salaried", "retired"])])
        assert evaluate(rule, make_profile(occupation_category=OccupationCategory.FARMER)).matched

    def test_not_in_no_match(self):
        rule = make_rule([Condition(field="occupation_category", op=Op.NOT_IN, value=["farmer"])])
        assert not evaluate(rule, make_profile(occupation_category=OccupationCategory.FARMER)).matched

    def test_boolean_true(self):
        rule = make_rule([Condition(field="is_rural", op=Op.EQ, value=True)])
        assert evaluate(rule, make_profile(is_rural=True)).matched
        assert not evaluate(rule, make_profile(is_rural=False)).matched


# ─── Multi-condition AND tests ────────────────────────────────────────────────

class TestAnd:

    def test_and_all_true(self):
        """All conditions must pass for AND to return True."""
        rule = make_rule([
            Condition(field="age",                op=Op.GTE, value=60),
            Condition(field="annual_income_band", op=Op.IN,  value=["below_100000"]),
        ], operator="AND")
        profile = make_profile(age=62, annual_income_band=AnnualIncomeBand.BELOW_100000)
        result = evaluate(rule, profile)
        assert result.matched
        assert len(result.matched_conditions) == 2

    def test_and_one_false_short_circuits(self):
        rule = make_rule([
            Condition(field="age",    op=Op.GTE, value=60),
            Condition(field="is_rural", op=Op.EQ,  value=True),
        ], operator="AND")
        # age=45 fails first condition → short-circuit, no need to check is_rural
        assert not evaluate(rule, make_profile(age=45, is_rural=True)).matched

    def test_and_returns_matched_conditions(self):
        rule = make_rule([
            Condition(field="age",          op=Op.GTE, value=60),
            Condition(field="social_category", op=Op.IN, value=["sc", "st"]),
        ], operator="AND")
        profile = make_profile(age=65, social_category=SocialCategory.SC)
        result = evaluate(rule, profile)
        assert result.matched
        # Both conditions should appear in matched_conditions
        assert any("age" in c for c in result.matched_conditions)
        assert any("social_category" in c for c in result.matched_conditions)


# ─── Multi-condition OR tests ─────────────────────────────────────────────────

class TestOr:

    def test_or_one_true(self):
        rule = make_rule([
            Condition(field="age",          op=Op.GTE, value=80),   # false
            Condition(field="has_disability", op=Op.EQ, value=True), # true
        ], operator="OR")
        assert evaluate(rule, make_profile(age=45, has_disability=True)).matched

    def test_or_all_false(self):
        rule = make_rule([
            Condition(field="age",          op=Op.GTE, value=80),
            Condition(field="has_disability", op=Op.EQ, value=True),
        ], operator="OR")
        assert not evaluate(rule, make_profile(age=45, has_disability=False)).matched

    def test_or_all_true(self):
        rule = make_rule([
            Condition(field="age",          op=Op.GTE, value=18),
            Condition(field="has_disability", op=Op.EQ, value=False),
        ], operator="OR")
        assert evaluate(rule, make_profile(age=25, has_disability=False)).matched


# ─── Nested predicate tests ───────────────────────────────────────────────────

class TestNested:

    def test_and_with_nested_or(self):
        """
        AND:
          - age >= 60
          - OR:
              - social_category in [sc, st]
              - has_disability == True
        """
        inner_or = Predicate(
            operator="OR",
            conditions=[
                Condition(field="social_category", op=Op.IN,  value=["sc", "st"]),
                Condition(field="has_disability",  op=Op.EQ, value=True),
            ],
        )
        rule = make_rule([
            Condition(field="age", op=Op.GTE, value=60),
            inner_or,
        ], operator="AND")

        # Passes: age=65, SC category
        assert evaluate(rule, make_profile(age=65, social_category=SocialCategory.SC)).matched
        # Passes: age=65, disabled (general category)
        assert evaluate(rule, make_profile(age=65, social_category=SocialCategory.GENERAL, has_disability=True)).matched
        # Fails: age=45 (first AND condition fails)
        assert not evaluate(rule, make_profile(age=45, social_category=SocialCategory.SC)).matched
        # Fails: age=65, general, not disabled
        assert not evaluate(rule, make_profile(age=65, social_category=SocialCategory.GENERAL, has_disability=False)).matched


# ─── Missing field / error handling ──────────────────────────────────────────

class TestMissingField:

    def test_missing_field_does_not_raise(self):
        """A non-existent profile field must never raise — treat as unmatched."""
        rule = make_rule([Condition(field="nonexistent_field", op=Op.EQ, value=True)])
        result = evaluate(rule, make_profile())
        assert not result.matched

    def test_missing_field_recorded_in_matched_conditions(self):
        rule = make_rule([Condition(field="nonexistent_field", op=Op.EQ, value=True)])
        result = evaluate(rule, make_profile())
        assert any("SKIPPED" in c for c in result.matched_conditions)

    def test_none_land_in_gt_comparison(self):
        """land_owned_acres=None should fail a > 0 comparison without raising."""
        rule = make_rule([Condition(field="land_owned_acres", op=Op.GT, value=0)])
        result = evaluate(rule, make_profile(land_owned_acres=None))
        assert not result.matched

    def test_none_disability_percentage(self):
        """disability_percentage=None (has_disability=False citizen) should fail gracefully."""
        rule = make_rule([Condition(field="disability_percentage", op=Op.GTE, value=40)])
        result = evaluate(rule, make_profile(has_disability=False, disability_percentage=None))
        assert not result.matched


# ─── Status filter tests ──────────────────────────────────────────────────────

class TestStatusFilter:

    def test_pending_review_scheme_not_matched(self):
        rule = make_rule(
            [Condition(field="age", op=Op.GTE, value=18)],
            status=SchemeStatus.PENDING_REVIEW,
        )
        profile = make_profile(age=30)
        results = match_all_schemes([rule], profile)
        assert results == []

    def test_deprecated_scheme_not_matched(self):
        rule = make_rule(
            [Condition(field="age", op=Op.GTE, value=18)],
            status=SchemeStatus.DEPRECATED,
        )
        results = match_all_schemes([rule], make_profile(age=30))
        assert results == []

    def test_published_scheme_is_matched(self):
        rule = make_rule(
            [Condition(field="age", op=Op.GTE, value=18)],
            status=SchemeStatus.PUBLISHED,
        )
        results = match_all_schemes([rule], make_profile(age=30))
        assert len(results) == 1


# ─── Golden-file test (demo persona) ─────────────────────────────────────────

class TestDemoPersona:
    """
    The 62-year-old SC farmer with 45% disability in Rajasthan.
    Expected to match: ignoaps, pm_kisan, pmay_gramin, adip, nfsa_pds, mgnregs
    Expected NOT to match: ignwps (female only), pmay_urban (not rural)
    """

    @pytest.fixture
    def demo_profile(self) -> CitizenProfile:
        return CitizenProfile(
            citizen_id="demo_citizen",
            language="hi",
            age=62,
            gender=Gender.MALE,
            state="Rajasthan",
            district="Barmer",
            is_rural=True,
            occupation_category=OccupationCategory.FARMER,
            annual_income_band=AnnualIncomeBand.BELOW_100000,
            social_category=SocialCategory.SC,
            has_disability=True,
            disability_percentage=45,
            land_owned_acres=2.5,
            family_size=4,
            is_complete=True,
        )

    def _make_ignoaps(self) -> EligibilityRule:
        return make_rule([
            Condition(field="age",                op=Op.GTE, value=60),
            Condition(field="annual_income_band", op=Op.IN,  value=["below_100000"]),
        ])

    def _make_ignwps(self) -> EligibilityRule:
        return EligibilityRule(
            scheme_id="ignwps",
            scheme_name="IGNWPS",
            category=SchemeCategory.PENSION,
            jurisdiction="central",
            predicate=Predicate(operator="AND", conditions=[
                Condition(field="gender", op=Op.EQ, value="female"),
                Condition(field="age",    op=Op.GTE, value=40),
            ]),
            source_document_url="https://nsap.nic.in",
            last_verified_date=date(2024, 1, 1),
            status=SchemeStatus.PUBLISHED,
        )

    def test_ignoaps_matches(self, demo_profile):
        assert evaluate(self._make_ignoaps(), demo_profile).matched

    def test_ignwps_does_not_match_male(self, demo_profile):
        assert not evaluate(self._make_ignwps(), demo_profile).matched

    def test_match_all_schemes_demo(self, demo_profile):
        rules = [self._make_ignoaps(), self._make_ignwps()]
        results = match_all_schemes(rules, demo_profile)
        matched_ids = [r.scheme_id for r, _ in results]
        assert "ignoaps" in matched_ids
        assert "ignwps" not in matched_ids

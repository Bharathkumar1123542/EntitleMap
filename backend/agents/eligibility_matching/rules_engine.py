"""
agents/eligibility_matching/rules_engine.py
Deterministic predicate evaluator — the heart of EntitleMap.

CONTRACT (per implementation.md §4.2):
  - evaluate(rule, profile) -> MatchResult
  - Zero network/IO calls. Runs fully in-process.
  - Never raises on missing profile fields — treats as unmatched,
    logs a SKIPPED warning in matched_conditions.
  - 100% reproducible: same inputs always produce same output.

Security: No dynamic eval(), no exec(), no external calls.
Testing:  All operator logic is covered by test_rules_engine.py.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, List, Optional

from models.citizen_profile import CitizenProfile
from models.eligibility_rule import Condition, ComparisonOperator, EligibilityRule, Predicate

logger = logging.getLogger(__name__)


@dataclass
class MatchResult:
    matched: bool
    matched_conditions: List[str] = field(default_factory=list)

    def __bool__(self) -> bool:
        return self.matched


# ---------------------------------------------------------------------------
# Leaf condition evaluator
# ---------------------------------------------------------------------------

def _get_field_value(profile: CitizenProfile, field_name: str) -> Optional[Any]:
    """
    Safely retrieve a field from the CitizenProfile.
    Returns None if the field doesn't exist (never raises).
    For enum fields, returns the .value string for comparison.
    """
    try:
        val = getattr(profile, field_name)
        # Unwrap enums so rules can compare against string values
        if hasattr(val, "value"):
            return val.value
        return val
    except AttributeError:
        return None


def _evaluate_condition(condition: Condition, profile: CitizenProfile) -> MatchResult:
    """
    Evaluate a single Condition against the profile.
    Returns MatchResult with a human-readable description of what matched/skipped.
    """
    raw_value = _get_field_value(profile, condition.field)
    desc = f"{condition.field} {condition.op.value} {condition.value!r}"

    # Missing field — fail closed, log warning
    if raw_value is None:
        logger.warning("Field '%s' missing from profile — treating as unmatched", condition.field)
        return MatchResult(matched=False, matched_conditions=[f"SKIPPED: {condition.field} not in profile"])

    op = condition.op
    rule_val = condition.value

    try:
        if op == ComparisonOperator.EQ:
            matched = raw_value == rule_val
        elif op == ComparisonOperator.NEQ:
            matched = raw_value != rule_val
        elif op == ComparisonOperator.GTE:
            matched = raw_value >= rule_val
        elif op == ComparisonOperator.LTE:
            matched = raw_value <= rule_val
        elif op == ComparisonOperator.GT:
            matched = raw_value > rule_val
        elif op == ComparisonOperator.LT:
            matched = raw_value < rule_val
        elif op == ComparisonOperator.IN:
            matched = raw_value in rule_val
        elif op == ComparisonOperator.NOT_IN:
            matched = raw_value not in rule_val
        else:
            logger.warning("Unknown operator '%s' — treating as unmatched", op)
            return MatchResult(matched=False, matched_conditions=[f"SKIPPED: unknown op {op}"])
    except TypeError as exc:
        logger.warning("Type error comparing %s: %s — treating as unmatched", desc, exc)
        return MatchResult(matched=False, matched_conditions=[f"SKIPPED: type error on {condition.field}"])

    return MatchResult(
        matched=matched,
        matched_conditions=[desc] if matched else [],
    )


# ---------------------------------------------------------------------------
# Recursive tree evaluator
# ---------------------------------------------------------------------------

def _evaluate_predicate(predicate: Predicate, profile: CitizenProfile) -> MatchResult:
    """
    Recursively evaluate an AND/OR predicate tree.
    Short-circuits: AND stops on first False, OR stops on first True.
    """
    results: List[MatchResult] = []
    all_conditions: List[str] = []

    for node in predicate.conditions:
        if isinstance(node, Condition):
            result = _evaluate_condition(node, profile)
        else:
            # Nested Predicate
            result = _evaluate_predicate(node, profile)

        results.append(result)
        all_conditions.extend(result.matched_conditions)

        # Short-circuit evaluation
        if predicate.operator == "AND" and not result.matched:
            return MatchResult(matched=False, matched_conditions=all_conditions)
        if predicate.operator == "OR" and result.matched:
            return MatchResult(matched=True, matched_conditions=all_conditions)

    # AND: all must match. OR: none matched (would have returned above).
    final = all(r.matched for r in results) if predicate.operator == "AND" \
        else any(r.matched for r in results)

    return MatchResult(matched=final, matched_conditions=all_conditions if final else [])


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def evaluate(rule: EligibilityRule, profile: CitizenProfile) -> MatchResult:
    """
    Evaluate a single EligibilityRule against a CitizenProfile.

    Returns MatchResult(matched=True/False, matched_conditions=[...]).
    - matched_conditions lists the conditions that evaluated to True (for explainability).
    - Conditions prefixed with 'SKIPPED:' indicate a missing profile field.
    - Never raises. Never makes network or IO calls.

    Example:
        result = evaluate(rule, profile)
        if result:
            print("Matched:", result.matched_conditions)
    """
    try:
        return _evaluate_predicate(rule.predicate, profile)
    except Exception as exc:  # noqa: BLE001
        logger.error("Unexpected error evaluating rule '%s': %s", rule.scheme_id, exc)
        return MatchResult(matched=False, matched_conditions=[f"ERROR: {exc}"])


def match_all_schemes(
    rules: List[EligibilityRule],
    profile: CitizenProfile,
) -> List[tuple[EligibilityRule, MatchResult]]:
    """
    Evaluate a profile against every rule in the knowledge base.
    Returns only the rules that matched, paired with their MatchResult.
    Skips any rules whose status != PUBLISHED.
    """
    from models.eligibility_rule import SchemeStatus

    matched = []
    for rule in rules:
        if rule.status != SchemeStatus.PUBLISHED:
            continue
        result = evaluate(rule, profile)
        if result.matched:
            matched.append((rule, result))
    return matched

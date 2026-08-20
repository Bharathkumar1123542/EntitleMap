"""
models/eligibility_rule.py
Pydantic model for a scheme's eligibility predicate tree.
Matches architecture.md §4.2 exactly.
"""

from __future__ import annotations

from datetime import date
from enum import Enum
from typing import Any, List, Literal, Union

from pydantic import BaseModel, Field


class SchemeCategory(str, Enum):
    INCOME_SUPPORT = "income_support"
    DISABILITY = "disability"
    AGRICULTURE = "agriculture"
    HOUSING = "housing"
    EDUCATION = "education"
    HEALTH = "health"
    PENSION = "pension"
    OTHER = "other"


class SchemeStatus(str, Enum):
    PENDING_REVIEW = "PENDING_REVIEW"
    PUBLISHED = "PUBLISHED"
    DEPRECATED = "DEPRECATED"


class ComparisonOperator(str, Enum):
    EQ = "=="
    NEQ = "!="
    GTE = ">="
    LTE = "<="
    GT = ">"
    LT = "<"
    IN = "in"
    NOT_IN = "not_in"


class Condition(BaseModel):
    """
    A single leaf predicate: field op value.
    Example: { "field": "age", "op": ">=", "value": 60 }
    """

    field: str = Field(..., description="CitizenProfile attribute name")
    op: ComparisonOperator
    value: Any = Field(..., description="Scalar, list, or enum string")


class Predicate(BaseModel):
    """
    A boolean tree node: AND/OR of Conditions or nested Predicates.
    Supports arbitrary nesting depth.
    """

    operator: Literal["AND", "OR"]
    conditions: List[Union[Condition, "Predicate"]]

    model_config = {"arbitrary_types_allowed": True}


# Enable self-referential model
Predicate.model_rebuild()


class EligibilityRule(BaseModel):
    """
    Complete scheme record — eligibility predicate + metadata.
    Every rule must have a traceable source_document_url before publish.
    """

    scheme_id: str = Field(..., min_length=1)
    scheme_name: str
    category: SchemeCategory
    jurisdiction: str = Field(
        ...,
        description="'central' or 'state:<state_name>' (e.g. 'state:rajasthan')",
    )
    predicate: Predicate
    source_document_url: str = Field(
        ...,
        description="URL of the official scheme document from which this rule was extracted",
    )
    last_verified_date: date
    status: SchemeStatus = SchemeStatus.PENDING_REVIEW

    # Embedded application template reference
    required_documents: List[str] = Field(default_factory=list)
    benefit_description: str = ""
    benefit_amount: str = ""
    application_authority: str = ""
    template_file_ref: str = ""

"""
models/citizen_profile.py
Pydantic model for the citizen's self-declared profile.
Matches architecture.md §4.1 exactly.
Security: No PII beyond the minimal fields listed here.
"""

from __future__ import annotations

import hashlib
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


class OccupationCategory(str, Enum):
    FARMER = "farmer"
    DAILY_WAGE_LABOR = "daily_wage_labor"
    SALARIED = "salaried"
    SELF_EMPLOYED = "self_employed"
    UNEMPLOYED = "unemployed"
    STUDENT = "student"
    RETIRED = "retired"
    OTHER = "other"


class AnnualIncomeBand(str, Enum):
    BELOW_100000 = "below_100000"
    BAND_100000_300000 = "100000_300000"
    BAND_300000_800000 = "300000_800000"
    ABOVE_800000 = "above_800000"


class SocialCategory(str, Enum):
    GENERAL = "general"
    OBC = "obc"
    SC = "sc"
    ST = "st"
    OTHER = "other"


class CitizenProfile(BaseModel):
    """
    Self-declared citizen profile used for eligibility matching.
    The citizen_id is derived by SHA-256 hashing the phone number
    externally — it is never stored in plaintext here.
    """

    citizen_id: str = Field(
        ...,
        description="SHA-256 hash of the citizen's phone number (never raw phone number)",
    )
    language: str = Field(
        default="en",
        description="BCP-47 language code selected by the citizen (e.g. 'hi', 'mr', 'ta')",
    )
    age: int = Field(..., ge=0, le=120, description="Age in years")
    gender: Gender
    state: str = Field(..., min_length=2, max_length=60)
    district: str = Field(..., min_length=2, max_length=80)
    is_rural: bool
    occupation_category: OccupationCategory
    annual_income_band: AnnualIncomeBand
    social_category: SocialCategory
    has_disability: bool
    disability_percentage: Optional[int] = Field(
        default=None,
        ge=0,
        le=100,
        description="Disability percentage (0–100). Required when has_disability=True.",
    )
    land_owned_acres: Optional[float] = Field(
        default=None, ge=0, description="Land owned in acres (None = no land)"
    )
    family_size: int = Field(..., ge=1, le=30)
    is_complete: bool = Field(default=False)

    @field_validator("disability_percentage")
    @classmethod
    def disability_percentage_required_when_disabled(
        cls, v: Optional[int], info
    ) -> Optional[int]:
        """disability_percentage must be set when has_disability=True."""
        # Access other field via info.data (Pydantic v2)
        if info.data.get("has_disability") and v is None:
            raise ValueError(
                "disability_percentage is required when has_disability=True"
            )
        return v

    @staticmethod
    def make_citizen_id(phone_number: str) -> str:
        """Hash the raw phone number to produce a stable citizen_id."""
        return hashlib.sha256(phone_number.encode()).hexdigest()

    def mark_complete(self) -> "CitizenProfile":
        """Returns a copy with is_complete=True."""
        return self.model_copy(update={"is_complete": True})

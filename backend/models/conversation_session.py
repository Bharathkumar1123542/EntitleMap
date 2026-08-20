"""
models/conversation_session.py
Firestore-backed session state for a citizen's conversation.
Matches architecture.md §4.6. TTL = 7 days per architecture.md §8.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field

from .citizen_profile import CitizenProfile
from .application_package import MatchedScheme, UnclaimedScheme


class ConversationPhase(str, Enum):
    LANGUAGE_SELECT = "LANGUAGE_SELECT"
    PROFILE_INTAKE = "PROFILE_INTAKE"
    MATCHING = "MATCHING"
    CLAIM_CONFIRMATION = "CLAIM_CONFIRMATION"
    DOCUMENT_GENERATION = "DOCUMENT_GENERATION"
    DELIVERY = "DELIVERY"
    COMPLETE = "COMPLETE"

    def next_phase(self) -> "ConversationPhase":
        """Returns the next phase in the strict state machine order."""
        order = list(ConversationPhase)
        idx = order.index(self)
        if idx + 1 < len(order):
            return order[idx + 1]
        return self  # COMPLETE is terminal


SESSION_TTL_DAYS = 7
PDF_RETENTION_DAYS = 30


class ConversationSession(BaseModel):
    """
    Session document stored in Firestore, keyed by citizen_id.
    Documents auto-expire via Firestore TTL after SESSION_TTL_DAYS.
    """

    citizen_id: str = Field(
        ...,
        description="SHA-256 hash of the citizen's phone number — never raw phone",
    )
    phase: ConversationPhase = ConversationPhase.LANGUAGE_SELECT
    citizen_profile: Optional[CitizenProfile] = None
    matched_schemes: List[MatchedScheme] = Field(default_factory=list)
    unclaimed_schemes: List[UnclaimedScheme] = Field(default_factory=list)

    # Claim-confirmation tracking: scheme_ids already answered
    claim_confirmed_ids: List[str] = Field(default_factory=list)

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    ttl_expires_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
        + timedelta(days=SESSION_TTL_DAYS)
    )

    # Idempotency: last processed Meta message ID to prevent duplicate processing
    last_meta_message_id: Optional[str] = None

    def touch(self) -> "ConversationSession":
        """Update updated_at timestamp (call on every session write)."""
        return self.model_copy(update={"updated_at": datetime.now(timezone.utc)})

    def advance_phase(self) -> "ConversationSession":
        """Move to the next conversation phase."""
        return self.model_copy(
            update={
                "phase": self.phase.next_phase(),
                "updated_at": datetime.now(timezone.utc),
            }
        )

    def is_expired(self) -> bool:
        """True if the session TTL has passed."""
        return datetime.now(timezone.utc) > self.ttl_expires_at

    @property
    def is_complete(self) -> bool:
        return self.phase == ConversationPhase.COMPLETE

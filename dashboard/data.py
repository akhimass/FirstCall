"""Realistic placeholder intake metrics for Morrison & Associates."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime


FIRM_NAME = "Morrison & Associates"
FIRM_TAGLINE = "Personal Injury · California & Nevada"
AVG_CASE_VALUE = 5_000


@dataclass(frozen=True)
class TodaySnapshot:
    total_calls: int
    qualified: int
    declined: int
    after_hours_calls: int
    after_hours_qualified: int
    business_hours_calls: int


@dataclass(frozen=True)
class WeeklySnapshot:
    qualified_leads: int
    consultations_booked: int
    retainers_signed: int
    total_calls: int


@dataclass(frozen=True)
class FunnelStage:
    label: str
    count: int


def get_today() -> TodaySnapshot:
    return TodaySnapshot(
        total_calls=23,
        qualified=14,
        declined=9,
        after_hours_calls=11,
        after_hours_qualified=8,
        business_hours_calls=12,
    )


def get_week() -> WeeklySnapshot:
    return WeeklySnapshot(
        total_calls=118,
        qualified_leads=87,
        consultations_booked=52,
        retainers_signed=31,
    )


def get_funnel() -> list[FunnelStage]:
    week = get_week()
    return [
        FunnelStage("Calls received", week.total_calls),
        FunnelStage("Qualified leads", week.qualified_leads),
        FunnelStage("Consultations booked", week.consultations_booked),
        FunnelStage("Retainers signed", week.retainers_signed),
    ]


def get_decline_reasons() -> dict[str, int]:
    return {
        "No physical injury / emotional distress only": 18,
        "Statute of limitations expired": 14,
        "Already represented by counsel": 12,
        "Outside practice area": 9,
        "Insufficient accident details": 8,
        "Caller declined to proceed": 6,
    }


def get_call_heatmap() -> tuple[list[str], list[str], list[list[int]]]:
    """Hour blocks (rows) × weekday columns. Realistic PI intake pattern."""
    hours = [
        "12–3 AM",
        "3–6 AM",
        "6–9 AM",
        "9 AM–12 PM",
        "12–3 PM",
        "3–6 PM",
        "6–9 PM",
        "9 PM–12 AM",
    ]
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    # Evening/weekend heavy — after-hours answering value prop
    values = [
        [1, 0, 2, 1, 1, 3, 4],   # 12-3 AM
        [0, 0, 1, 0, 1, 2, 3],   # 3-6 AM
        [2, 3, 4, 3, 3, 5, 4],   # 6-9 AM
        [8, 9, 11, 10, 9, 4, 3], # 9-12
        [6, 7, 8, 9, 8, 5, 4],   # 12-3
        [5, 6, 7, 8, 7, 6, 5],   # 3-6
        [9, 10, 12, 11, 10, 14, 12],  # 6-9 PM peak
        [7, 8, 9, 8, 9, 16, 15],      # 9-12 PM peak
    ]
    return hours, days, values


def estimated_pipeline(qualified_leads: int, conversion_to_retainer: float = 0.36) -> int:
    """Qualified leads × expected retainer rate × average case value."""
    return int(qualified_leads * conversion_to_retainer * AVG_CASE_VALUE)


def format_currency(amount: int) -> str:
    if amount >= 1_000_000:
        return f"${amount / 1_000_000:.1f}M"
    if amount >= 1_000:
        return f"${amount:,}"
    return f"${amount}"

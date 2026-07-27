from __future__ import annotations

from typing import Any


class Segmenter:
    """Assign a customer segment based on basic heuristics when clustering artifacts are unavailable."""

    def __init__(self) -> None:
        self.default_segment = "unknown"

    def segment_customer(self, features: dict[str, Any]) -> dict[str, Any]:
        if not features:
            raise ValueError("Customer features must not be empty.")

        if "tenure" in features:
            tenure = float(features["tenure"])
            if tenure < 12:
                segment = "new"
            elif tenure < 36:
                segment = "growth"
            else:
                segment = "loyal"
        else:
            segment = self.default_segment

        return {"segment": segment}

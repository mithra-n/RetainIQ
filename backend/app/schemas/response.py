from typing import Any

from pydantic import BaseModel, Field


class PredictionResponse(BaseModel):
    """Response schema for churn prediction with explanation and recommendations."""

    prediction: int | None = Field(default=None, description="Predicted churn label")
    probability: float | None = Field(default=None, description="Prediction probability")
    customer_segment: str | None = Field(default=None, description="Assigned customer segment")
    shap_values: list[dict[str, Any]] | None = Field(default=None, description="Local SHAP contribution values")
    recommendations: list[dict[str, Any]] | None = Field(default=None, description="Personalized retention recommendations")

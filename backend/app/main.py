from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers.predict import router as prediction_router

app = FastAPI(
    title="RetainIQ",
    description="FastAPI backend for customer churn prediction and retention insights.",
    version=settings.app_version,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction_router)


@app.on_event("startup")
async def startup_event() -> None:
    app.state.ready = True


@app.get("/")
def read_root() -> dict:
    return {"message": "RetainIQ API is running."}


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok", "service": "RetainIQ"}

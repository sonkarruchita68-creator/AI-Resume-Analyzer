from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.routers import upload
from app.routers import history

from app.database.db import engine
from app.database.base import Base

from app.models import user
from app.models import resume_analysis

app = FastAPI(title="AI Resume Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {
        "message": "AI Resume Analyzer Backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(upload.router)
app.include_router(history.router)
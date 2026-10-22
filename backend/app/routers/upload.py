from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import os
import shutil
import json

from app.services.pdf_parser import extract_text_from_pdf
from app.services.docx_parser import extract_text_from_docx
from app.services.analysis_service import analyze_resume

from app.database.db import get_db
from app.models.resume_analysis import ResumeAnalysis


router = APIRouter(prefix="/resume", tags=["Resume"])

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    allowed_extensions = [".pdf", ".docx", ".txt"]

    file_extension = os.path.splitext(file.filename)[1].lower()

    if file_extension not in allowed_extensions:
        return {
            "error": "Only PDF, DOCX and TXT files are allowed"
        }

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = ""

    if file_extension == ".pdf":
        text = extract_text_from_pdf(file_path)

    elif file_extension == ".docx":
        text = extract_text_from_docx(file_path)

    elif file_extension == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

    if not text.strip():
        return {
            "error": "Could not extract text from the resume."
        }

    analysis = analyze_resume(text)

    resume_record = ResumeAnalysis(
        filename=file.filename,
        email=analysis["email"],
        phone=analysis["phone"],
        score=analysis["score"],
        skills=json.dumps(analysis["skills"]),
        sections_found=json.dumps(analysis["sections_found"]),
        missing_sections=json.dumps(analysis["missing_sections"]),
        suggestions=json.dumps(analysis["suggestions"])
    )

    db.add(resume_record)
    db.commit()
    db.refresh(resume_record)

    return {
        "message": "Resume analyzed and saved successfully",
        "id": resume_record.id,
        "filename": file.filename,
        "analysis": analysis
    }
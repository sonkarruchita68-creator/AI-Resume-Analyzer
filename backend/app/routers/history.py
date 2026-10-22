from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from app.database.db import get_db
from app.models.resume_analysis import ResumeAnalysis


router = APIRouter(prefix="/resume", tags=["Resume History"])


@router.get("/history")
def get_resume_history(db: Session = Depends(get_db)):

    resumes = (
        db.query(ResumeAnalysis)
        .order_by(ResumeAnalysis.id.desc())
        .all()
    )

    result = []

    for resume in resumes:
        result.append({
            "id": resume.id,
            "filename": resume.filename,
            "email": resume.email,
            "phone": resume.phone,
            "score": resume.score,
            "skills": json.loads(resume.skills) if resume.skills else [],
            "sections_found": (
                json.loads(resume.sections_found)
                if resume.sections_found else []
            ),
            "missing_sections": (
                json.loads(resume.missing_sections)
                if resume.missing_sections else []
            ),
            "suggestions": (
                json.loads(resume.suggestions)
                if resume.suggestions else []
            )
        })

    return {
        "total": len(result),
        "resumes": result
    }

@router.delete("/history/{resume_id}")
def delete_resume_history(
    resume_id: int,
    db: Session = Depends(get_db)
):
    resume = (
        db.query(ResumeAnalysis)
        .filter(ResumeAnalysis.id == resume_id)
        .first()
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    db.delete(resume)
    db.commit()

    return {
        "message": "Resume history deleted successfully",
        "id": resume_id
    }
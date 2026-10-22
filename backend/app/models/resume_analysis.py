from sqlalchemy import Column, Integer, String, Text
from app.database.base import Base


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    score = Column(Integer, nullable=False)
    skills = Column(Text, nullable=True)
    sections_found = Column(Text, nullable=True)
    missing_sections = Column(Text, nullable=True)
    suggestions = Column(Text, nullable=True)
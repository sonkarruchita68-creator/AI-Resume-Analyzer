from app.services.resume_parser import extract_email, extract_phone
from app.services.skill_extractor import extract_skills


IMPORTANT_SECTIONS = [
    "education",
    "experience",
    "skills",
    "projects",
    "certifications",
]


def analyze_resume(text):
    text_lower = text.lower()

    email = extract_email(text)
    phone = extract_phone(text)
    skills = extract_skills(text)

    sections_found = []

    for section in IMPORTANT_SECTIONS:
        if section in text_lower:
            sections_found.append(section)

    missing_sections = [
        section
        for section in IMPORTANT_SECTIONS
        if section not in sections_found
    ]

    score = 0

    # Skills score
    if len(skills) >= 5:
        score += 30
    elif len(skills) >= 3:
        score += 20
    elif len(skills) >= 1:
        score += 10

    # Contact information score
    if email:
        score += 10

    if phone:
        score += 10

    # Resume sections score
    score += len(sections_found) * 10

    # Maximum score = 100
    score = min(score, 100)

    suggestions = []

    if not email:
        suggestions.append("Add a professional email address.")

    if not phone:
        suggestions.append("Add a valid phone number.")

    if len(skills) < 5:
        suggestions.append("Add more relevant technical skills.")

    if "projects" not in sections_found:
        suggestions.append("Add a Projects section with practical projects.")

    if "experience" not in sections_found:
        suggestions.append("Add internship, training, or relevant experience.")

    if "certifications" not in sections_found:
        suggestions.append("Add relevant certifications or courses.")

    return {
        "score": score,
        "email": email,
        "phone": phone,
        "skills": skills,
        "sections_found": sections_found,
        "missing_sections": missing_sections,
        "suggestions": suggestions,
    }
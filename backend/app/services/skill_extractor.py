import re


SKILLS = [
    "Python",
    "Java",
    "C",
    "C++",
    "JavaScript",
    "HTML",
    "CSS",
    "SQL",
    "MySQL",
    "FastAPI",
    "Django",
    "Flask",
    "React",
    "Node.js",
    "Git",
    "GitHub",
    "Docker",
    "Machine Learning",
    "Artificial Intelligence",
    "Data Science",
    "Excel",
    "Power BI",
    "Tableau",
]


def extract_skills(text):
    found_skills = []

    for skill in SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, text, re.IGNORECASE):
            found_skills.append(skill)

    return found_skills

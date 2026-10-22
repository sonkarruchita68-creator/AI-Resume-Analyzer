\# AI Resume Analyzer



An AI-powered web application that analyzes resumes and provides useful feedback to improve them.



\## Features



\* Upload resumes in PDF, DOCX, or TXT format

\* Extract contact information and skills

\* Calculate a resume score

\* Identify missing resume sections

\* Provide suggestions for improvement

\* View previous resume analyses

\* Delete resume history

\* Download analysis reports as PDF



\## Technologies Used



\* \*\*Frontend:\*\* React, Vite, JavaScript, CSS

\* \*\*Backend:\*\* Python, FastAPI

\* \*\*Database:\*\* SQLite

\* \*\*Libraries:\*\* SQLAlchemy, PyPDF



\## Project Structure



\* `backend/app/` : FastAPI backend

\* `backend/frontend/` : React frontend

\* `backend/requirements.txt` : Python dependencies



\## How to Run



\### 1. Start the Backend



Open PowerShell in the `backend` folder and activate your virtual environment:



```powershell

.\\.venv\\Scripts\\Activate.ps1

python -m uvicorn app.main:app --reload

```



\### 2. Start the Frontend



Open another terminal in `backend/frontend` and run:



```powershell

npm install

npm run dev

```



Open the local URL shown in your terminal to use the application.



\## Author



Ruchita Sonkar




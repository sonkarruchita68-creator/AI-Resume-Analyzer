import { useState } from "react";
import { jsPDF } from "jspdf";
import "./App.css";

function App() {
const [file, setFile] = useState(null);
const [loading, setLoading] = useState(false);
const [result, setResult] = useState(null);
const [error, setError] = useState("");
const [history, setHistory] = useState([]);
const [showHistory, setShowHistory] = useState(false);

const handleUpload = async (event) => {
  event.preventDefault();

  if (!file) {
    setError("Please select your resume first.");
    return;
  }

  setLoading(true);
  setError("");
  setResult(null);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://127.0.0.1:8000/resume/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error || "Resume upload failed.");
    }

    console.log("Resume Analysis Result:", data.analysis);
    setResult(data.analysis);
  } catch (err) {
    console.error("Resume upload error:", err);

    setError(
      err.message === "Failed to fetch"
        ? "Backend se connection nahi ho raha. Check karo ki FastAPI server running hai."
        : err.message
    );
  } finally {
    setLoading(false);
  }
};

const loadHistory = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/resume/history");

    if (!response.ok) {
      throw new Error("Could not load resume history.");
    }

    const data = await response.json();

setHistory(Array.isArray(data) ? data : data.resumes || []);
    setShowHistory(true);
  } catch (err) {
    setError(err.message);
  }
};

const deleteResume = async (resumeId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this resume history?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/resume/history/${resumeId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to delete resume.");
    }

    setHistory((previousHistory) =>
      previousHistory.filter((item) => item.id !== resumeId)
    );

    alert("Resume history deleted successfully!");
  } catch (err) {
    setError(err.message);
  }
};

const downloadReport = () => {
  if (!result) {
    alert("Please analyze a resume first.");
    return;
  }

  const doc = new jsPDF();
  let y = 20;

  const addText = (text) => {
    const lines = doc.splitTextToSize(String(text), 170);

    if (y + lines.length * 7 > 280) {
      doc.addPage();
      y = 20;
    }

    doc.text(lines, 20, y);
    y += lines.length * 7;
  };

  doc.setFontSize(20);
  addText("AI Resume Analyzer Report");

  doc.setFontSize(12);
  y += 5;

  addText(`Resume Score: ${result.score ?? "N/A"}/100`);
  addText(`Email: ${result.email || "Not found"}`);
  addText(`Phone: ${result.phone || "Not found"}`);

  y += 5;
  addText("Skills Found:");

  (result.skills || []).forEach((skill) => {
    addText(`• ${skill}`);
  });

  y += 5;
  addText("Missing Sections:");

  (result.missing_sections || []).forEach((section) => {
    addText(`• ${section}`);
  });

  y += 5;
  addText("Improvement Suggestions:");

  (result.suggestions || []).forEach((suggestion) => {
    addText(`• ${suggestion}`);
  });

  doc.save("Resume_Analysis_Report.pdf");
};


return ( <div className="app"> <header className="topbar"> <div className="brand"> <div className="brand-icon">R</div> <span>Resume<span className="brand-highlight">IQ</span></span> </div> <span className="header-badge">AI Resume Analyzer</span> </header>

  <main className="container">
    <section className="hero">
      <span className="eyebrow">YOUR CAREER, UPGRADED</span>
      <h1>
        Make your resume
        <br />
        <span>stand out.</span>
      </h1>
      <p>
        Upload your resume to check your score, discover your skills,
        and find ways to improve your profile.
      </p>
    </section>

    <section className="upload-card">
      <div className="section-heading">
        <div>
          <span className="step-label">STEP 01</span>
          <h2>Upload your resume</h2>
        </div>
        <span className="file-label">PDF · DOCX · TXT</span>
      </div>

      <form onSubmit={handleUpload}>
        <label className="dropzone">
          <div className="upload-icon">↑</div>
          <strong>{file ? file.name : "Choose your resume"}</strong>
          <span>
            {file
              ? "File selected successfully"
              : "Click here to browse files from your computer"}
          </span>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(event) => {
              setFile(event.target.files?.[0] || null);
              setError("");
              setResult(null);
            }}
          />
        </label>

        <button className="analyze-button" type="submit" disabled={loading}>
          {loading ? "Analyzing resume..." : "Analyze my resume →"}
        </button>
      </form>

        <button type="button" onClick={loadHistory}>
          View Resume History
        </button>

{showHistory && (
  <div className="history-section">
    <h2>Resume History</h2>

    {history.length === 0 ? (
      <p>No resume history found.</p>
    ) : (
      history.map((item) => (
        <div key={item.id} className="history-card">
          <h3>{item.filename}</h3>

          <p>
            Resume Score: {item.score ?? "Not available"}
          </p>

          <p>
            Email: {item.email || "Not available"}
          </p>

          <button
            type="button"
            onClick={() => deleteResume(item.id)}
            className="delete-button"
          >
            Delete
          </button>
        </div>
      ))
    )}Delete
  </div>
)}

      {error && <p className="error-message">{error}</p>}
    </section>

    {result && (
      <section className="results">
        <div className="results-heading">
          <span className="step-label">STEP 02</span>
          <h2>Your resume report</h2>
          <p>Here is what we found in your resume.</p>
        </div>

        <div className="score-card">
          <div>
            <span className="result-label">RESUME SCORE</span>
            <h3>{result.score}<span>/100</span></h3>
            <p>Based on skills and important resume sections.</p>
            <div className="score-progress">
  <div
    className="score-progress-fill"
    style={{
      width: `${Math.min(100, Math.max(0, Number(result.score) || 0))}%`,
    }}
  ></div>
</div>

          </div>
          <div
            className="score-circle"
            style={{
              "--score": `${result.score}%`,
            }}
          >
            <div>{result.score}%</div>
          </div>
        </div>
 
 <button
type="button"
onClick={downloadReport}
className="download-button"

>

Download PDF Report </button>

        <div className="result-grid">
          <article className="result-card">
            <span className="result-label">CONTACT DETAILS</span>
            <h3>Contact information</h3>
            <p>Email: {result.email || "Not found"}</p>
            <p>Phone: {result.phone || "Not found"}</p>
          </article>

          <article className="result-card">
            <span className="result-label">SKILLS DETECTED</span>
            <h3>Your skills</h3>
            <div className="chips">
              {result.skills?.length ? (
                result.skills.map((skill) => (
                  <span className="chip" key={skill}>{skill}</span>
                ))
              ) : (
                <p>No matching skills detected.</p>
              )}
            </div>
          </article>

          <article className="result-card">
            <span className="result-label">RESUME STRUCTURE</span>
            <h3>Sections found</h3>
            <div className="chips">
              {result.sections_found?.length ? (
                result.sections_found.map((section) => (
                  <span className="chip success-chip" key={section}>
                    ✓ {section}
                  </span>
                ))
              ) : (
                <p>No important sections detected.</p>
              )}
            </div>
            <h4>Missing sections</h4>
            <div className="chips">
              {result.missing_sections?.length ? (
                result.missing_sections.map((section) => (
                  <span className="chip missing-chip" key={section}>
                    {section}
                  </span>
                ))
              ) : (
                <p>No missing sections detected.</p>
              )}
            </div>
          </article>

          <article className="result-card">
            <span className="result-label">NEXT STEPS</span>
            <h3>Improvement suggestions</h3>
            {result.suggestions?.length ? (
              <ul className="suggestions">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            ) : (
              <p>Your resume has no suggestions from this basic check.</p>
            )}
          </article>
        </div>
      </section>
    )}

    <footer>
      ResumeIQ · Built to help you take the next career step.
    </footer>
  </main>
</div>
);
}

export default App;

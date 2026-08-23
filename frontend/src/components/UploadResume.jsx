import { useState, useRef } from "react";
import { uploadResume, listCandidates } from "../api";

// Phase 5 UI for Phase 1+2 of the backend: drop/select a resume, POST it,
// then show the parsed result (skills/experience/education) once the LLM
// structuring step comes back. Also lists everything uploaded so far.

export default function UploadResume({ candidates, refreshCandidates }) {
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'ok'|'error', message }
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    setLoading(true);
    setStatus(null);
    try {
      await uploadResume(file);
      setStatus({ type: "ok", message: `Parsed and saved "${file.name}".` });
      await refreshCandidates();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <>
      <h1 className="page-title">Upload resumes</h1>
      <p className="page-sub">
        PDF or plain text. Each file is parsed and structured into skills,
        experience, and education automatically.
      </p>

      <div className="card">
        <div
          className={`dropzone ${dragActive ? "dropzone--active" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
        >
          <strong>{loading ? "Parsing…" : "Drop a resume here"}</strong>
          <div>or click to browse (PDF or .txt, up to 5MB)</div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {status && (
          <p className={`status status--${status.type}`}>{status.message}</p>
        )}
      </div>

      <div className="card">
        <div className="field">
          <label>Candidates on file ({candidates.length})</label>
        </div>
        {candidates.length === 0 && (
          <div className="empty">No resumes uploaded yet.</div>
        )}
        {candidates.map((c) => (
          <div className="list-item" key={c._id}>
            <div>
              <div className="list-item__name">{c.name}</div>
              <div className="list-item__meta">{c.fileName}</div>
              <div className="tag-row">
                {c.parsed?.skills?.slice(0, 6).map((skill) => (
                  <span className="tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

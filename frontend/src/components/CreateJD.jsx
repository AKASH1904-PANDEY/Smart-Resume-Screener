import { useState } from "react";
import { createJD } from "../api";

// Phase 5 UI for the job-description half of Phase 1: a simple form to add
// a JD, plus a list of JDs already on file (used as the dropdown source on
// the Shortlist tab).

export default function CreateJD({ jds, refreshJDs }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) {
      setStatus({ type: "error", message: "Job description text is required." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await createJD({ title, text });
      setStatus({ type: "ok", message: "Job description saved." });
      setTitle("");
      setText("");
      await refreshJDs();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="page-title">Job descriptions</h1>
      <p className="page-sub">
        Add the role you're screening for. Candidates get scored against this
        text directly.
      </p>

      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="jd-title">Title (optional)</label>
          <input
            id="jd-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Backend Engineer, Node.js"
          />
        </div>
        <div className="field">
          <label htmlFor="jd-text">Job description text</label>
          <textarea
            id="jd-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the full job description here…"
          />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save job description"}
        </button>
        {status && (
          <p className={`status status--${status.type}`}>{status.message}</p>
        )}
      </form>

      <div className="card">
        <div className="field">
          <label>On file ({jds.length})</label>
        </div>
        {jds.length === 0 && <div className="empty">No job descriptions yet.</div>}
        {jds.map((jd) => (
          <div className="list-item" key={jd._id}>
            <div>
              <div className="list-item__name">{jd.title || "Untitled role"}</div>
              <div className="list-item__meta">
                {jd.text.slice(0, 120)}
                {jd.text.length > 120 ? "…" : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

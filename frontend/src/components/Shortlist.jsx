import { useState } from "react";
import { createMatch, getShortlist } from "../api";
import ScoreStamp from "./ScoreStamp";

// Phase 5 UI for Phase 3+4: pick a JD, score any unscored candidates against
// it, then pull the ranked shortlist. This is the page recruiters actually
// live in, so the score stamp gets the visual weight here.

export default function Shortlist({ candidates, jds }) {
  const [jdId, setJdId] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState(null);
  const [scoring, setScoring] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  async function handleScoreAll() {
    if (!jdId) {
      setStatus({ type: "error", message: "Pick a job description first." });
      return;
    }
    setScoring(true);
    setStatus(null);
    try {
      // Score every candidate on file against this JD. The backend upserts,
      // so re-running this is safe and just refreshes stale scores.
      for (const candidate of candidates) {
        await createMatch({ candidateId: candidate._id, jdId });
      }
      setStatus({ type: "ok", message: `Scored ${candidates.length} candidate(s).` });
      await handleLoadShortlist();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setScoring(false);
    }
  }

  async function handleLoadShortlist() {
    if (!jdId) return;
    setLoadingList(true);
    try {
      const data = await getShortlist(jdId, minScore);
      setResults(data);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoadingList(false);
    }
  }

  return (
    <>
      <h1 className="page-title">Shortlist</h1>
      <p className="page-sub">
        Score candidates against a role, then rank by fit. Highest score
        first.
      </p>

      <div className="card">
        <div className="select-row">
          <div className="field">
            <label htmlFor="jd-select">Job description</label>
            <select
              id="jd-select"
              value={jdId}
              onChange={(e) => setJdId(e.target.value)}
            >
              <option value="">Select a role…</option>
              {jds.map((jd) => (
                <option key={jd._id} value={jd._id}>
                  {jd.title || "Untitled role"}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ maxWidth: 140 }}>
            <label htmlFor="min-score">Min score</label>
            <input
              id="min-score"
              type="text"
              inputMode="numeric"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>

        <button
          className="btn"
          onClick={handleScoreAll}
          disabled={scoring || !jdId || candidates.length === 0}
        >
          {scoring ? "Scoring…" : `Score all candidates (${candidates.length})`}
        </button>{" "}
        <button
          className="btn btn--ghost"
          onClick={handleLoadShortlist}
          disabled={loadingList || !jdId}
        >
          {loadingList ? "Loading…" : "Refresh shortlist"}
        </button>

        {status && (
          <p className={`status status--${status.type}`}>{status.message}</p>
        )}
      </div>

      <div className="card">
        {results.length === 0 && (
          <div className="empty">
            No results yet — select a role and score candidates.
          </div>
        )}
        {results.map((match) => (
          <div className="shortlist-row" key={match._id}>
            <ScoreStamp score={match.score} />
            <div>
              <div className="shortlist-row__name">
                {match.candidate?.name || "Unknown candidate"}
              </div>
              <div className="shortlist-row__justification">
                {match.justification}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

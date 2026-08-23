import { useState, useEffect, useCallback } from "react";
import UploadResume from "./components/UploadResume";
import CreateJD from "./components/CreateJD";
import Shortlist from "./components/Shortlist";
import { listCandidates, listJDs } from "./api";

// App shell: a left-hand tab rail (folder-tab metaphor) switching between
// the three phases a recruiter actually uses. Candidate/JD lists live here
// so all three tabs share one source of truth instead of re-fetching
// independently.

const TABS = [
  { id: "upload", label: "Upload resumes" },
  { id: "jds", label: "Job descriptions" },
  { id: "shortlist", label: "Shortlist" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("upload");
  const [candidates, setCandidates] = useState([]);
  const [jds, setJds] = useState([]);

  const refreshCandidates = useCallback(async () => {
    const data = await listCandidates();
    setCandidates(data);
  }, []);

  const refreshJDs = useCallback(async () => {
    const data = await listJDs();
    setJds(data);
  }, []);

  useEffect(() => {
    refreshCandidates().catch(() => {});
    refreshJDs().catch(() => {});
  }, [refreshCandidates, refreshJDs]);

  return (
    <div className="app">
      <aside className="rail">
        <div className="rail__brand">
          Screening Desk
          <span>Smart Resume Screener</span>
        </div>
        <nav className="rail__nav">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              className="rail__tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="rail__tab-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main">
        {activeTab === "upload" && (
          <UploadResume
            candidates={candidates}
            refreshCandidates={refreshCandidates}
          />
        )}
        {activeTab === "jds" && <CreateJD jds={jds} refreshJDs={refreshJDs} />}
        {activeTab === "shortlist" && (
          <Shortlist candidates={candidates} jds={jds} />
        )}
      </main>
    </div>
  );
}

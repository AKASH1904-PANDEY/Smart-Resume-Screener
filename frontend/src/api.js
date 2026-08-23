// Thin wrapper around fetch so components don't repeat base-URL / error
// handling boilerplate. Reads the backend URL from Vite's env so it's easy
// to point at a deployed API later without touching component code.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${BASE_URL}/resumes`, {
    method: "POST",
    body: formData,
  });
  return handle(res);
}

export async function listCandidates() {
  const res = await fetch(`${BASE_URL}/resumes`);
  return handle(res);
}

export async function createJD({ title, text }) {
  const res = await fetch(`${BASE_URL}/jd`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, text }),
  });
  return handle(res);
}

export async function listJDs() {
  const res = await fetch(`${BASE_URL}/jd`);
  return handle(res);
}

export async function createMatch({ candidateId, jdId }) {
  const res = await fetch(`${BASE_URL}/matches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ candidateId, jdId }),
  });
  return handle(res);
}

export async function getShortlist(jdId, minScore = 0) {
  const res = await fetch(
    `${BASE_URL}/matches/shortlist?jdId=${jdId}&minScore=${minScore}`
  );
  return handle(res);
}

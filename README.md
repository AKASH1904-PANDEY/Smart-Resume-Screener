# Smart Resume Screener
🔗 **Live demo:** https://smart-resume-screener-eight.vercel.app/
🔗 **Backend API:** https://smart-resume-screener-8jiy.onrender.com

> Note: the backend is on Render's free tier and spins down after
> inactivity — the first request may take 30-50 seconds to wake up.

Parses resumes, extracts structured data, and scores candidate fit against
a job description using an LLM.

> Covers **Phase 1–5**: setup, parsing, LLM matching, storage/shortlisting,
> and a frontend dashboard ("Screening Desk").

## Stack

**Backend**
- Node.js + Express
- MongoDB (Mongoose)
- Claude API (`@anthropic-ai/sdk`) for structuring and matching
- `pdf-parse` for PDF text extraction
- `multer` for file uploads

**Frontend**
- React (Vite)
- Plain CSS (no UI framework) — see `frontend/src/styles.css`

## Setup

**Backend**
```bash
npm install
cp .env.example .env   # fill in MONGODB_URI and ANTHROPIC_API_KEY
npm run dev            # or: node src/server.js
```

**Frontend** (in a second terminal)
```bash
cd frontend
npm install
cp .env.example .env   # points at the backend, defaults to localhost:5000
npm run dev
```
Opens at `http://localhost:5173`. Three tabs: **Upload resumes**, **Job
descriptions**, **Shortlist** — score candidates against a role and view
ranked results with justifications.

## Architecture

```
[Resume Upload]           [Job Description]
      │                          │
      ▼                          │
[Parser: pdf-parse]              │
      │                          │
      ▼                          │
[LLM: structureResume] ←── Prompt 1
      │                          │
      ▼                          ▼
[MongoDB: Candidate]      [MongoDB: JobDescription]
      │                          │
      └──────────┬───────────────┘
                  ▼
          [LLM: scoreMatch] ←── Prompt 2
                  │
                  ▼
          [MongoDB: Match]
                  │
                  ▼
        [GET /shortlist?jdId=] → ranked candidates
```

## LLM Prompts

**Prompt 1 — Structuring** (`src/services/llmService.js` → `structureResume`)
Extracts `name`, `skills`, `experience`, `education` from raw resume text as
strict JSON, so it can be stored and queried directly.

**Prompt 2 — Matching** (`src/services/llmService.js` → `scoreMatch`)
> "Compare the following resume with this job description and rate fit on
> 1–10 with justification."
Returns `{ score, justification }` as JSON, stored per candidate/JD pair.

## API Endpoints

| Method | Route                          | Description                          |
|--------|---------------------------------|---------------------------------------|
| POST   | `/api/resumes`                 | Upload + parse + structure a resume (form field: `resume`) |
| GET    | `/api/resumes`                 | List all candidates |
| GET    | `/api/resumes/:id`             | Get one candidate |
| POST   | `/api/jd`                      | Create a job description (`{ title, text }`) |
| GET    | `/api/jd`                      | List job descriptions |
| POST   | `/api/matches`                 | Score a candidate against a JD (`{ candidateId, jdId }`) |
| GET    | `/api/matches/shortlist?jdId=` | Ranked shortlist for a JD (optional `&minScore=`) |



# Smart Resume Screener

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

## Notes

- Uploaded files are deleted after text extraction — only extracted text is
  persisted, keeping the repo/DB free of raw file storage.
- Re-scoring the same candidate/JD pair updates the existing match instead
  of duplicating it.

## Demo video script (suggested, 2–3 min)

1. Show `Upload resumes` tab — drop 2–3 sample resumes, point out the
   parsed skills tags appearing per candidate.
2. Show `Job descriptions` tab — paste a JD, save it.
3. Show `Shortlist` tab — select the JD, click "Score all candidates,"
   then "Refresh shortlist." Narrate the ranked stamps + justifications.
4. Briefly show the two LLM prompts in `src/services/llmService.js` and
   the ranked-query logic in `matchController.js`.

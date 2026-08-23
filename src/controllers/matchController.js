// Phase 3: score a candidate against a JD using the LLM matching prompt.
// Phase 4: return a ranked shortlist for a given JD, pulled from stored
// Match documents — no LLM calls needed here, just a sorted DB query.

const Candidate = require("../models/Candidate");
const JobDescription = require("../models/JobDescription");
const Match = require("../models/Match");
const { scoreMatch } = require("../services/llmService");

async function createMatch(req, res) {
  const { candidateId, jdId } = req.body;

  if (!candidateId || !jdId) {
    return res.status(400).json({ error: "candidateId and jdId are required" });
  }

  const candidate = await Candidate.findById(candidateId);
  const jd = await JobDescription.findById(jdId);

  if (!candidate) return res.status(404).json({ error: "Candidate not found" });
  if (!jd) return res.status(404).json({ error: "Job description not found" });

  try {
    const { score, justification } = await scoreMatch(candidate.rawText, jd.text);

    // upsert: re-matching the same pair updates the existing score
    // instead of creating a duplicate (enforced by the unique index too).
    const match = await Match.findOneAndUpdate(
      { candidate: candidateId, jobDescription: jdId },
      { score, justification },
      { new: true, upsert: true }
    );

    res.status(201).json(match);
  } catch (err) {
    console.error("createMatch error:", err);
    res.status(500).json({ error: "Failed to score match", details: err.message });
  }
}

async function getShortlist(req, res) {
  const { jdId } = req.query;
  const minScore = Number(req.query.minScore) || 0;

  if (!jdId) {
    return res.status(400).json({ error: "jdId query param is required" });
  }

  const matches = await Match.find({
    jobDescription: jdId,
    score: { $gte: minScore },
  })
    .populate("candidate", "name fileName parsed")
    .sort({ score: -1 }); // highest fit first

  res.json(matches);
}

module.exports = { createMatch, getShortlist };

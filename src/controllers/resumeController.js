// Phase 1+2: receives an uploaded resume, extracts its text, runs it
// through the LLM structuring prompt, and saves a Candidate document.

const fs = require("fs/promises");
const Candidate = require("../models/Candidate");
const { extractText } = require("../services/parser");
const { structureResume } = require("../services/llmService");

async function uploadResume(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded (field name: resume)" });
  }

  const { path: filePath, originalname, mimetype } = req.file;

  try {
    // 1. Extract raw text from the uploaded file.
    const rawText = await extractText(filePath, mimetype);

    if (!rawText) {
      return res.status(422).json({ error: "Could not extract any text from the file" });
    }

    // 2. Ask the LLM to structure it into skills / experience / education.
    const structured = await structureResume(rawText);

    // 3. Save everything to MongoDB.
    const candidate = await Candidate.create({
      name: structured.name || "Unknown",
      fileName: originalname,
      rawText,
      parsed: {
        skills: structured.skills || [],
        experience: structured.experience || [],
        education: structured.education || [],
      },
    });

    res.status(201).json(candidate);
  } catch (err) {
    console.error("uploadResume error:", err);
    res.status(500).json({ error: "Failed to process resume", details: err.message });
  } finally {
    // Clean up the temp file regardless of success/failure — only the
    // extracted text needs to live on, in the database.
    fs.unlink(filePath).catch(() => {});
  }
}

async function listCandidates(req, res) {
  const candidates = await Candidate.find().sort({ createdAt: -1 });
  res.json(candidates);
}

async function getCandidate(req, res) {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) {
    return res.status(404).json({ error: "Candidate not found" });
  }
  res.json(candidate);
}

module.exports = { uploadResume, listCandidates, getCandidate };

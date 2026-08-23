// Phase 1: simple CRUD for job descriptions. JDs are plain text — no
// parsing needed here, since the LLM reads them directly at match time.

const JobDescription = require("../models/JobDescription");

async function createJD(req, res) {
  const { title, text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "text field is required" });
  }

  const jd = await JobDescription.create({ title, text });
  res.status(201).json(jd);
}

async function listJDs(req, res) {
  const jds = await JobDescription.find().sort({ createdAt: -1 });
  res.json(jds);
}

async function getJD(req, res) {
  const jd = await JobDescription.findById(req.params.id);
  if (!jd) {
    return res.status(404).json({ error: "Job description not found" });
  }
  res.json(jd);
}

module.exports = { createJD, listJDs, getJD };

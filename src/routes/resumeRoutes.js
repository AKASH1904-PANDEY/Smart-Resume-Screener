const express = require("express");
const upload = require("../middleware/upload");
const {
  uploadResume,
  listCandidates,
  getCandidate,
} = require("../controllers/resumeController");

const router = express.Router();

// POST /api/resumes  -> multipart/form-data, field name "resume"
router.post("/", upload.single("resume"), uploadResume);
router.get("/", listCandidates);
router.get("/:id", getCandidate);

module.exports = router;

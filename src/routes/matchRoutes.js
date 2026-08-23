const express = require("express");
const { createMatch, getShortlist } = require("../controllers/matchController");

const router = express.Router();

// POST /api/matches           -> { candidateId, jdId } => score one pair
// GET  /api/matches/shortlist -> ?jdId=...&minScore=... => ranked list
router.post("/", createMatch);
router.get("/shortlist", getShortlist);

module.exports = router;

// A Candidate document = one uploaded resume, after parsing.
// rawText keeps the full extracted text (needed later for LLM matching).
// parsed.* holds the structured fields the LLM pulls out in Phase 2.

const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Unknown",
    },
    fileName: {
      type: String,
      required: true,
    },
    rawText: {
      type: String,
      required: true,
    },
    parsed: {
      skills: [{ type: String }],
      experience: [{ type: String }],
      education: [{ type: String }],
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model("Candidate", candidateSchema);

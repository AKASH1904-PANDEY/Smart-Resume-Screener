// A Match document = the result of scoring one Candidate against one
// JobDescription. We store it (instead of recomputing every time) so
// Phase 4's shortlist endpoint can just query and sort — no repeat LLM calls.

const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    jobDescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobDescription",
      required: true,
    },
    score: {
      type: Number, // 1-10, as required by the assignment spec
      required: true,
    },
    justification: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevents duplicate scoring of the same candidate against the same JD.
matchSchema.index({ candidate: 1, jobDescription: 1 }, { unique: true });

module.exports = mongoose.model("Match", matchSchema);

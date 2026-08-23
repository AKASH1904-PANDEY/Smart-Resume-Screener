// A JobDescription document = one JD the candidates get matched against.
// Kept deliberately simple: title is optional metadata, text is what
// actually gets sent to the LLM for matching.

const mongoose = require("mongoose");

const jdSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled Job",
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobDescription", jdSchema);

// Phase 2 (structuring) + Phase 3 (matching) both live here — they're the
// two distinct LLM calls the assignment asks us to document in the README.
//
// Using Gemini (free tier, no credit card needed). We ask for JSON directly
// via responseMimeType so the model returns clean JSON without needing to
// strip markdown fences ourselves.

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = "gemini-3.6-flash";

/**
 * Prompt 1 — Structuring.
 * Takes raw resume text, asks the LLM to pull out skills / experience /
 * education as a clean JSON object.
 */
async function structureResume(rawText) {
  const systemPrompt =
    "You extract structured data from resumes. " +
    'Respond with a JSON object of shape: {"name": string, "skills": string[], "experience": string[], "education": string[]}. ' +
    "If a field can't be found, return an empty array (or \"Unknown\" for name).";

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: rawText,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
}

/**
 * Prompt 2 — Matching.
 * Compares one resume's text against a job description and returns a
 * 1-10 fit score with justification, exactly as the assignment spec's
 * example prompt describes.
 */
async function scoreMatch(resumeText, jdText) {
  const systemPrompt =
    "You are a recruiting assistant. Compare the following resume with this " +
    "job description and rate fit on 1-10 with justification. " +
    'Respond with a JSON object of shape: {"score": number, "justification": string}. ' +
    "score must be an integer from 1 to 10.";

  const userPrompt = `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
}

module.exports = { structureResume, scoreMatch };
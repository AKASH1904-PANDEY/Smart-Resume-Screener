// pdf-parse v2 switched from a plain function call to a class-based API:
// old (v1): const data = await pdfParse(buffer); data.text
// new (v2): const parser = new PDFParse({ data: buffer }); (await parser.getText()).text
const { PDFParse } = require("pdf-parse");
const fs = require("fs/promises");

/**
 * Reads a file from disk and returns its extracted plain text.
 * @param {string} filePath - path to the uploaded file (set by multer)
 * @param {string} mimeType - the file's mime type, used to pick the parser
 * @returns {Promise<string>} extracted text
 */
async function extractText(filePath, mimeType) {
  const buffer = await fs.readFile(filePath);

  if (mimeType === "application/pdf") {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text.trim();
  }

  // Fallback: treat anything else (e.g. .txt) as plain UTF-8 text.
  return buffer.toString("utf-8").trim();
}

module.exports = { extractText };
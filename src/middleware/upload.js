// Configures multer to accept a single file field named "resume".
// Files are written to src/uploads/ temporarily — the parser reads them,
// then the controller deletes the file since only the extracted text
// (stored in MongoDB) needs to persist.

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});

function fileFilter(req, file, cb) {
  const allowed = ["application/pdf", "text/plain"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF or .txt files are allowed"));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap
});

module.exports = upload;

// Entry point: loads env vars, connects to MongoDB, wires up routes,
// and starts the HTTP server. Kept thin on purpose — all real logic
// lives in controllers/services.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const resumeRoutes = require("./routes/resumeRoutes");
const jdRoutes = require("./routes/jdRoutes");
const matchRoutes = require("./routes/matchRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Health check — useful to confirm the server is up before testing routes.
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/resumes", resumeRoutes);
app.use("/api/jd", jdRoutes);
app.use("/api/matches", matchRoutes);

// Catch-all error handler — makes sure unexpected errors return JSON,
// not an HTML stack trace.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong", details: err.message });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

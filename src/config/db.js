// Handles the MongoDB connection for the whole app.
// mongoose.connect() returns a promise, so we wrap it and exit the process
// if it fails — no point running an API that can't reach its database.

const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is missing from .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;

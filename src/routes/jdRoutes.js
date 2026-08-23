const express = require("express");
const { createJD, listJDs, getJD } = require("../controllers/jdController");

const router = express.Router();

router.post("/", createJD);
router.get("/", listJDs);
router.get("/:id", getJD);

module.exports = router;

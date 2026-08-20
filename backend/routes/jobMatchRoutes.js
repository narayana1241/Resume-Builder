const express = require("express");
const router = express.Router();
const { analyzeJobMatch, fetchJobUrl } = require("../controllers/jobMatchController");

router.post("/analyze", analyzeJobMatch);
router.get("/fetch-url", fetchJobUrl);

module.exports = router;

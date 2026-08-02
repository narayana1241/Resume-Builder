const express = require("express");

const router = express.Router();

const { saveExperience } = require("../controllers/experienceController");

router.post("/save", saveExperience);

module.exports = router;
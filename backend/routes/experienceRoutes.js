const express = require("express");

const router = express.Router();

const { saveExperience, deleteExperience } = require("../controllers/experienceController");

router.post("/save", saveExperience);
router.delete("/delete/:id", deleteExperience);

module.exports = router;
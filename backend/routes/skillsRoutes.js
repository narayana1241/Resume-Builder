const express = require("express");

const router = express.Router();

const {

    saveSkills,

    getSkills

} = require("../controllers/skillsController");

// Save Skill
router.post("/save", saveSkills);

// Get Added Skills
router.get("/list/:resume_id", getSkills);

module.exports = router;
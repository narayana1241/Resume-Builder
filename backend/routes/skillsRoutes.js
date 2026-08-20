const express = require("express");

const router = express.Router();

const {
    saveSkills,
    getSkills,
    deleteSkills
} = require("../controllers/skillsController");

// Save Skill
router.post("/save", saveSkills);

// Get Added Skills
router.get("/list/:resume_id", getSkills);

// Delete Skill
router.delete("/delete/:id", deleteSkills);

module.exports = router;
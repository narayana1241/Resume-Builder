const express = require("express");

const router = express.Router();

const {
    saveProjects,
    getProjects,
    deleteProjects
} = require("../controllers/projectsController");

// =============================
// Save Project
// =============================

router.post("/save", saveProjects);

// =============================
// Get Projects by Resume ID
// =============================

router.get("/list/:resume_id", getProjects);

// =============================
// Delete Project
// =============================

router.delete("/delete/:id", deleteProjects);

module.exports = router;
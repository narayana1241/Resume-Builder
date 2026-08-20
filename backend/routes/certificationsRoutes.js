const express = require("express");

const router = express.Router();

const {
    saveCertifications,
    getCertifications,
    deleteCertifications
} = require("../controllers/certificationsController");

// Save Certification
router.post("/save", saveCertifications);

// Get Added Certifications
router.get("/list/:resume_id", getCertifications);

// Delete Certification
router.delete("/delete/:id", deleteCertifications);

module.exports = router;
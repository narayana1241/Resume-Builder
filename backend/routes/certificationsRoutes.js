const express = require("express");

const router = express.Router();

const {

    saveCertifications,

    getCertifications

} = require("../controllers/certificationsController");

// Save Certification
router.post("/save", saveCertifications);

// Get Added Certifications
router.get("/list/:resume_id", getCertifications);

module.exports = router;
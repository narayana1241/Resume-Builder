const express = require("express");
const router = express.Router();
const { 
    analyzeAtsScore,
    getAtsDashboard,
    downloadAtsReport
} = require("../controllers/atsController");

router.post("/analyze", analyzeAtsScore);
router.get("/dashboard/:resume_id", getAtsDashboard);
router.get("/report/:resume_id", downloadAtsReport);

module.exports = router;

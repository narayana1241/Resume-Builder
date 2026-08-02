const express = require("express");

const router = express.Router();

const {
    getResumePreview
} = require("../controllers/resumepreviewController");

router.get("/list/:resume_id", getResumePreview);

module.exports = router;
const express = require("express");

const router = express.Router();

const { 
    createResume,
    listUserResumes,
    deleteResume,
    saveResumeJson,
    saveFullUploadResume,
    getEditorResume
} = require("../controllers/resumeController");

router.post("/create", createResume);
router.get("/list/:user_id", listUserResumes);
router.delete("/delete/:resume_id", deleteResume);
router.post("/save-json", saveResumeJson);
router.post("/save-full-upload", saveFullUploadResume);
router.get("/editor/:resume_id", getEditorResume);

module.exports = router;
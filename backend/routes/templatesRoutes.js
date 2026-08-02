const express = require("express");
const router = express.Router();

const {
    getAllResumeTemplates
} = require("../controllers/templatesController");

router.get("/", getAllResumeTemplates);

module.exports = router;
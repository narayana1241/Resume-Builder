const express = require("express");

const router = express.Router();

const { saveEducation, deleteEducation } = require("../controllers/educationController");

router.post("/save", saveEducation);
router.delete("/delete/:id", deleteEducation);

module.exports = router;
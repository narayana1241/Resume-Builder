const express = require("express");

const router = express.Router();

const { savePersonalDetails } = require("../controllers/personalController");

router.post("/save", savePersonalDetails);

module.exports = router;
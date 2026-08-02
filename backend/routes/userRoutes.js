const express = require("express");
const router = express.Router();

const {
    loginUser,
    registerUser,
    getUserProfile
} = require("../controllers/userController");

router.post("/login", loginUser);

router.post("/register", registerUser);

router.get("/profile/:id", getUserProfile);

module.exports = router;
const express = require("express");
const router = express.Router();
const {register, login, getProfile} = require("../controllers/auth.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

router.post("/register", isLoggedIn, isAdmin, register);
router.post("/login", login);

router.get("/getProfile", isLoggedIn, getProfile);

module.exports = router;
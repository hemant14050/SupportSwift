const express = require("express");
const router = express.Router();
const {register, login} = require("../controlles/auth.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

router.post("/register", isLoggedIn, isAdmin, register);
router.post("/login", login);

module.exports = router;
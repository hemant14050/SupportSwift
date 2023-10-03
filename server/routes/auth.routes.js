const express = require("express");
const router = express.Router();
const {register, login, getProfile, deleteUser} = require("../controllers/auth.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);

router.get("/getProfile", isLoggedIn, getProfile);
router.delete("/deleteUser", isLoggedIn, isAdmin, deleteUser);
module.exports = router;
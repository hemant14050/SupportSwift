const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/auth");
const { handlePostChat, handleGetChat } = require("../controllers/chat.controller");

router.post("/:id/chat/postChat", isLoggedIn, handlePostChat);
router.get("/:id/chat/getChat", isLoggedIn, handleGetChat);

module.exports = router;
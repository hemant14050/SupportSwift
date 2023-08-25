const express = require("express");
const router = express.Router();
const {createTicket, getTicket, updateTicket, deleteTicket, getMyTickets} = require("../controlles/ticket.controller");
const { isLoggedIn } = require("../middlewares/auth");

router.post("/createTicket", isLoggedIn, createTicket);
router.get("/getTicket/:id", isLoggedIn, getTicket);
router.put("/updateTicket/:id", isLoggedIn, updateTicket);
router.delete("/deleteTicket/:id", isLoggedIn, deleteTicket);

router.get("/getMyTickets", isLoggedIn, getMyTickets);

module.exports = router;
const Chat = require("../models/Chat");
const Ticket = require("../models/Ticket");
const { default: mongoose } = require("mongoose");

exports.handlePostChat = async(req, res) => {
    try {
        // get user from req
        const user = req.user;
        const ticketId = req.params.id;
        const {text} = req.body;

        if(!text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Text is required"
            });
        }
        
        const exists = await Ticket.findById({_id: ticketId})
        .populate("createdBy", {password: false})
        .populate("assignedTo")
        .exec();
        if(!exists) {
            return res.status(400).json({
                success: false,
                message: "Ticket id invalid, chat not posted"
            });
        }

        if(!(exists.createdBy._id.equals(new mongoose.Types.ObjectId(req.user.id)) || exists.assignedTo.departmentName === req.user.departmentName || req.user.role === "Admin")) {
            return res.status(400).json({ 
                success: false,
                message: `Ticket with id ${ticketId} not found in you a/c`
            });
        }

        const newChat = await Chat.create({
            sender: user.id,
            text: text
        });

        const updatedTicket = await Ticket.findByIdAndUpdate({_id: ticketId}, 
            {
                "$push": {
                    chats: newChat._id,
                }
            }, {new: true})
            .populate({
                path: "chats",
                populate: {
                    path: "sender",
                    select: "firstName lastName"
                }
            })
            .exec();
        
        return res.status(200).json({
            success: true,
            ticket: updatedTicket,
            message: "Chat posted successfully"
        });

    } catch(err) {
        console.log("Error: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
        });
    }
}

exports.handleGetChat = async(req, res) => {
    try {
        // get user from req
        const user = req.user;
        const ticketId = req.params.id;

        const exists = await Ticket.findById({_id: ticketId})
        .populate("createdBy", {password: false})
        .populate("assignedTo")
        .exec();

        if(!exists) {
            return res.status(400).json({
                success: false,
                message: "Ticket id invalid, chat cannot get"
            });
        }

        if(!(exists.createdBy._id.equals(new mongoose.Types.ObjectId(req.user.id)) || exists.assignedTo.departmentName === req.user.departmentName || req.user.role === "Admin")) {
            return res.status(400).json({ 
                success: false,
                message: `Ticket with id ${id} not found in you a/c`
            });
        }

        const ticketWithChats = await Ticket.findById({_id: ticketId}, {select: "chats"})
            .populate({
                path: "chats",
                populate: {
                    path: "sender",
                    select: "firstName lastName"
                }
            })
            .exec();
        
        return res.status(200).json({
            success: true,
            chat: ticketWithChats,
            message: "Chat fetched successfully"
        });

    } catch(err) {
        console.log("Error: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
        });
    }
}
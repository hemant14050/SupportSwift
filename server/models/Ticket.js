const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true,
    },
    status: {
        type: String,
        enum: ["Open", "In Progress", "Closed"],
        default: "Open",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    closedAt: {
        type: Date,
    },
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    }]
}, {timestamps: true});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket; 
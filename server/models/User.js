const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        required: true,
    },
    ticketsRaised: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
    }],
    ticketsAssigned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket"
    }]
}, {timestamps: true});

const User = mongoose.model("User", userSchema);
module.exports = User; 
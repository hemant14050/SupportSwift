const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        trim: true,
        required: true,
    },
    media: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media"
    },
}, {timestamps: true});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
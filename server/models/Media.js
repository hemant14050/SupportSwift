const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
});

const Media = mongoose.model("Media", mediaSchema);
module.exports = Media;
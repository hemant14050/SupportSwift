const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema({
    departmentName: {
        type: String,
        required: true,
        trim: true
    },
    ticketsAssigned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket"
    }],
});

const Department = mongoose.model("Department", departmentSchema);
module.exports = Department;
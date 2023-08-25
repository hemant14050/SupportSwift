const Ticket = require("../models/Ticket");
const Department = require("../models/Department");
const { default: mongoose } = require("mongoose");
const User = require("../models/User");

exports.createTicket = async(req, res) => {
    try {
        // get data from req.body
        const {title, description, priority, department, status} = req.body;
        // get user req.user
        const user = req.user;

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // validation
        if(!title || !description || !priority || !department || !status) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }
        // db call
        const oldDepartment = await Department.findOne({departmentName: department});
        // console.log(oldDepartment);
        if(!oldDepartment) {
            return res.status(400).json({
                success: false,
                message: "Department name is invalid"
            });
        }


        const newTicket = await Ticket.create({
            title: title,
            description: description,
            priority: priority,
            createdBy: user.id,
            status: status,
            assignedTo: oldDepartment._id,
        });

        // update in user --push objId
        const updatedUser = await User.findByIdAndUpdate({_id: user.id}, 
            {
                "$push": {
                    ticketsRaised: newTicket._id,
                }
            });

        const updatedDepartment = await Department.findByIdAndUpdate({_id: oldDepartment.id}, 
            {
                "$push": {
                    ticketsAssigned: newTicket._id,
                }
            });

        // return response
        return res.status(200).json({
            success: true,
            ticket: newTicket,
            message: "Ticket created successfully!"
        });

    } catch(err) {
        console.log("Error: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}

exports.getTicket = async(req, res) => {
    try {
        // get id
        const {id} = req.params;
        // get status to update
        const currTicket = await Ticket.findById({_id: id})
        .populate("createdBy", {password: false})
        .populate("assignedTo")
        .exec();

        if(!currTicket) {
            return res.status(400).json({
                success: false,
                message: `Ticket with id ${id} not found`
            });
        }

        // console.log(currTicket.createdBy._id);
        // console.log(new mongoose.Types.ObjectId(req.user.id));
        if(!currTicket.createdBy._id.equals(new mongoose.Types.ObjectId(req.user.id))) {
            return res.status(400).json({
                success: false,
                message: `Ticket with id ${id} not found in you a/c`
            });
        }

        if(!currTicket) {
            return res.status(400).json({
                success: true,
                message: `Ticket with id ${id} not found`
            });
        }

        return res.status(200).json({
            success: true,
            ticket: currTicket,
            message: "Ticket fetched successfully!"
        });

    } catch(err) {
        console.log("Error: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}

exports.updateTicket = async(req, res) => {
    try {
        // get id
        const {id} = req.params;
        // get status to update
        const {status} = req.body;
        if(!status) {
            return res.status(400).json({
                success: false,
                message: "Status not provided",
            });
        }
        const updatedTicket = await Ticket.findByIdAndUpdate({_id: id}, {status: status});
        console.log("Status: ", status);
        return res.status(200).json({
            success: true,
            message: "Ticket status updated successfully!",
        });

    } catch(err) {
        console.log("Error: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}

exports.deleteTicket = async(req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(400).json({
                success: false,
                message: `Ticket id missing!`
            });
        }
        const deletedTicket = await Ticket.findByIdAndDelete({_id: id});
        // console.log(deletedTicket);
        if(!deletedTicket) {
            return res.status(400).json({
                success: false,
                message: `Ticket with id ${id} not found!`
            });
        }
        return res.status(200).json({
            success: true,
            ticket: deletedTicket,
            message: `Ticket with id ${id} deleted!`
        });

    } catch(err) {
        console.log("Error: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}

exports.getMyTickets = async(req, res) => {
    try {
        // get user 
        const user = req.user;
        // find tickets by user id
        const myTickets = await Ticket.find({createdBy: user.id});
        // console.log(myTickets);
        // return res
        return res.status(200).json({
            success: true,
            tickets: myTickets,
            message: "All my created tickets are fetched!"
        });

    } catch(err) {
        console.log("Error: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}
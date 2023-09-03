const Ticket = require("../models/Ticket");
const Department = require("../models/Department");
const { default: mongoose } = require("mongoose");
const User = require("../models/User");

exports.createTicket = async(req, res) => {
    try {
        // get data from req.body
        const {title, description, priority, department, status="Open"} = req.body;
        // get user req.user
        const user = req.user;

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // validation
        if(!title.trim() || !description.trim() || !priority || !department || !status) {
            // return res.status(400).json({
            //     success: false,
            //     message: "All fields are required!"
            // });
            return res.redirect('/raiseTicket/error?message=All+fields+are+required!');
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
        // return res.status(200).json({
        //     success: true,
        //     ticket: newTicket,
        //     message: "Ticket created successfully!"
        // });
        return res.redirect('/raiseTicket/success?ticketId=' + newTicket._id + '&message=Ticket+created+successfully!');

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
        const user = req.user;

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

        // console.log("Delete: ", deletedTicket.assignedTo);

        // pull it from users and department
        const updatedUser = await User.findByIdAndUpdate({_id: user.id}, 
            {
                "$pull": {
                    ticketsRaised: deletedTicket._id,
                }
            });

        const updatedDepartment = await Department.findByIdAndUpdate({_id: deletedTicket.assignedTo._id}, 
            {
                "$pull": {
                    ticketsAssigned: deletedTicket._id,
                }
            });

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
        const myTickets = await Ticket.find({createdBy: user.id})
        .populate({
            path: "createdBy",
            select: "firstName lastName"
        })
        .populate({
            path: "assignedTo",
            select: "departmentName"
        })
        .populate({
            path: "chats",
            populate: {
                path: "sender",
                select: "firstName lastName"
            }
        })
        .exec();
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

exports.getMyDepartmentTickets = async(req, res) => {
    try {
        const user = req.user;
        // console.log(user.department);

        const myDeptInfo = await Department.findById({_id: user.department})
        .populate({
            path: "ticketsAssigned",
            populate: [
                {
                    path: "createdBy",
                    // select: "-password"
                    select: "firstName lastName email department role"
                }, 
                {
                    path: "chats",
                    populate: {
                        path: "sender",
                        select: "firstName lastName"
                    }
                },
                {
                    path: "assignedTo",
                    select: "departmentName"
                }
            ]
        })
        .exec();

        return res.status(200).json({
            success: true,
            myDeptInfo,
            message: "myDeptInfo get successfully!"
        });

    } catch(err) {
        console.log("Error: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server error"
        });
    }
}
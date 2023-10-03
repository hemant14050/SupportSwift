const Department = require("../models/Department");
const User = require("../models/User");

exports.addDepartment = async(req, res) => {
    try {
        const {departmentName} = req.body;
        // not null
        if(!departmentName) {
            return res.status(400).json({
                success: false,
                message: "Please specify Department Name"
            });
        }
        // check department is already exists with same name
        const exists = await Department.findOne({departmentName: departmentName});
        if(exists) {
            return res.status(400).json({
                success: false,
                message: "Department is already exists!"
            });
        }

        const department = await Department.create({
            departmentName: departmentName,
        });
        return res.status(200).json({
            success: true,
            department: department,
            message: "Department created successfully!"
        });

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

exports.getAllDepartments = async(req, res) => {
    try {
        // make db call get all depts
        const allDepts = await Department.find({departmentName : {$ne : "Admin"}});
        // console.log(allDepts);

        // return res
        return res.status(200).json({
            success: true,
            allDepartments: allDepts,
            user: req.user,
            message: "All Departments data fetched successfully!",
        });

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

exports.deleteDepartment = async(req, res) => {
    try {
        // get id from params of req
        const {id} = req.params;
        // console.log("id: ", id);
        // validation
        if(!id) {
            return res.status(400).json({
                success: false,
                message: `Department id is missing`,
            });
        }
        // delete from db
        const response = await Department.findByIdAndDelete({_id: id});
        // return response
        if(!response) {
            return res.status(400).json({
                success: false,
                message: `Department with id ${id} not found`,
            });
        }
        return res.status(200).json({
            success: true,
            message: `Department with id ${id} deleted successfully`,
        });

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

exports.getUserDashboardData = async(req, res) => {
    try {
        const userId = req.user.id;
        const deptId = req.user.departmentId;
        // console.log("userId: ", userId);
        // console.log("useDeptName: ", deptId);
        // validation
        if(!userId) {
            return res.status(400).json({
                success: false,
                message: `User id is missing`,
            });
        }
        if(req.user.role === "Admin") {
            const allDepartments = await Department.find({});
            // console.log(allDepartments);
            const stats = await Promise.all(allDepartments.map(async(dept) => {
                const statusCounts = dept.ticketsAssigned.reduce((accum, curr, index) => {
                    if(curr.status === "Open") {
                        accum.openCount++;
                    }
                    if(curr.status === "In Progress") {
                        accum.inProgressCount++;
                    }
                    if(curr.status === "Closed") {
                        accum.closedCount++;
                    }
                    return accum;
                }, {
                    openCount: 0,
                    inProgressCount: 0,
                    closedCount: 0,
                });
                return {
                    departmentName: dept.departmentName,
                    totalTicketsAssined: dept.ticketsAssigned.length,
                    statusCounts
                };
            }));

            return res.status(200).json({
                success: true,
                user: req.user,
                stats,
                message: "Admin Dashboard data fetched successfully!"
            });

        } else {
            const departmentTickets = await Department.findById(deptId)
            .populate("ticketsAssigned")
            .exec();

            if(!departmentTickets) {
                return res.status(400).json({
                    success: false,
                    message: `Department with id ${deptId} not found`,
                });
            }

            const statusCounts = departmentTickets.ticketsAssigned.reduce((accum, curr, index) => {
                if(curr.status === "Open") {
                    accum.openCount++;
                }
                if(curr.status === "In Progress") {
                    accum.inProgressCount++;
                }
                if(curr.status === "Closed") {
                    accum.closedCount++;
                }
                return accum;
            }, {
                openCount: 0,
                inProgressCount: 0,
                closedCount: 0,
            });

            const stats = {
                departmentName: departmentTickets.departmentName,
                totalTicketsAssined: departmentTickets.ticketsAssigned.length,
                statusCounts
            };
            
            return res.status(200).json({
                success: true,
                user: req.user,
                stats,
                message: "User Dashboard data fetched successfully!"
            });
        }
        

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

exports.getAllUsersDepartmentsData = async(req, res) => {
    try {
        const allDepartments = await Department.find({departmentName : {$ne : "Admin"}})
        .populate("ticketsAssigned")
        .exec();

        const allUsers = await User.find({role: "User"}, {firstName: 1, lastName: 1, role:1, email: 1, department: 1, createdAt: 1})
        .populate("department")
        .exec();

        // console.log(allDepartments);
        // console.log(allUsers);

        const returnData = allDepartments.map((dept, index) => {
            const users = allUsers.filter((user) => {
                return user.department.departmentName === dept.departmentName;
            });
            dept = dept.toObject();
            dept.users = users;
            dept.totalTicketsAssined = dept.ticketsAssigned.length;
            return dept;
        });
        
        return res.status(200).json({
            success: true,
            returnData,
            user: req.user,
            message: "All Users Departments data fetched successfully!",
        });

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
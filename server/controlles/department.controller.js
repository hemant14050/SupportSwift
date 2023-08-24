const Department = require("../models/Department");

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
        const allDepts = await Department.find({});
        // console.log(allDepts);

        // return res
        return res.status(200).json({
            success: true,
            allDepartments: allDepts,
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
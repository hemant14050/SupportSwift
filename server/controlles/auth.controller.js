const User = require("../models/User");
const Department = require("../models/Department");
const generatePassword = require("generate-password");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {sendMail} = require("../utils/mailer");

/**
 * 200 - Success
 * 400 - Bad request
 * 404 - Not found
 * 401 - Unauthorized
 * 500 - Internal server error
 */

exports.register = async(req, res) => {
    try {
        const {firstName, lastName, email, role, departmentName} = req.body;
        // all fields are required
        if(!firstName || !lastName || !email || !role || !departmentName) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }   
        // check if department is valid
        const department = await Department.findOne({departmentName: departmentName});
        if(!department) {
            return res.status(400).json({
                success: false,
                message: "Department Not exists!",
            });
        }

        // check use email exists
        const userExists = await User.findOne({email: email});
        if(userExists) {
            return res.status(401).json({
                success: false,
                message: "User email already registered, use another email or login"
            });
        }

        // generate default password and send email to user
        const defaultPassword = generatePassword.generate({
            length: 10,
            numbers: true,
        });
        // console.log("Neww Pass: ", defaultPassword);

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        const newUser = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            role: role,
            department: department._id,
        });

        // send mail
        try {
            // console.log("Email printing: ", email);
            const mailResponse = await sendMail(email, {password: defaultPassword});

            return res.status(200).json({
                success: true,
                message: "User created successfully and email sent to user"
            });
            
        } catch(err) {
            console.log("Error: ", err);
            return res.status(200).json({
                success: true,
                message: "User created successfully, but email not sent user"
            });
        }

    } catch(err) {
        console.log("Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
        });
    }
}

exports.login = async(req, res) => {
    try {
        const {email, password} = req.body;
        
        // check all fields are valid
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            });
        }
        // check user with email
        const currUser = await User.findOne({email: email});
        if(!currUser) {
            return res.status(402).json({
                success: false,
                message: "User with this email not exists!",
            });
        }
        // check password
        if(await bcrypt.compare(password, currUser.password)) {
            
            // generate token using JWT
            // add payload
            const payload = {
                id: currUser._id,
                firstName: currUser.firstName,
                lastName: currUser.lastName,
                email: currUser.email,
                role: currUser.role,
            }
            currUser.password = undefined;

            // make token
            const token = jwt.sign({user:payload}, process.env.JWT_SECRET, {expiresIn: "24h"});

            // options for cookie
            const options = {
                // set to expires in 2days
                expire: new Date(Date.now() + (2*24*60*60*1000)),
                // cookie access by web-browser only
                httpOnly: true,
            }
            return res.cookie("token", token, options).status(200).json({
                success: true,
                user: currUser,
                message: "User logged in successfullly!"
            });
            
        } else {
            return res.status(401).json({
                success: false,
                message: "Password incorrect",
            });
        }
        // return response

    } catch(err) {
        console.log("Error: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
        });
    }
}
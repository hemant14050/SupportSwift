const jwt = require("jsonwebtoken");

exports.isLoggedIn = async(req, res, next) => {
    try {
        // get token
        const token = req.cookies.token;
        // console.log("Toekn: ", token);
        if(!token) {
            return res.status(500).json({
                success: false,
                message: `Token not found`,
            });
        }
        // verify token jwt verify
        // get payload after verify
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoode: ", decoded);
        req.user = decoded.user;

        // send to next request
        next();

    } catch(err) {
        console.log("Error: ", err);
        return res.status(500).json({
            success: false,
            message: `Internal server Error`,
        });
    }
} 

exports.isAdmin = async(req, res, next) => {
    try {
        // get user from req which is added in isLoggedIn middleware
        const user = req.user;
        if(user.role !== "Admin") {
            return res.status(400).json({
                success: false,
                message: `This is protected route for admin`,
            });
        }

        next();

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: `Internal server Error`,
        });
    }
}
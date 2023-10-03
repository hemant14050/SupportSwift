const express = require("express");
const router = express.Router();
const {
    addDepartment, 
    getAllDepartments, 
    deleteDepartment, 
    getUserDashboardData,
    getAllUsersDepartmentsData,

} = require("../controllers/department.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

/**
 * ***************************************************
 * PROTECTED ROUTES FOR ADMIN
 * ***************************************************
 */
router.get("/getAllUsersDepartmentsData", isLoggedIn, isAdmin, getAllUsersDepartmentsData);

router.post("/addDepartment", isLoggedIn, isAdmin, addDepartment);
router.get("/getAllDepartments", isLoggedIn, getAllDepartments); 
router.delete("/deleteDepartment/:id", isLoggedIn, isAdmin, deleteDepartment);
router.get("/getDashboardData", isLoggedIn, getUserDashboardData);


module.exports = router;
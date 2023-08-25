const express = require("express");
const router = express.Router();
const {addDepartment, getAllDepartments, deleteDepartment} = require("../controllers/department.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

/**
 * ***************************************************
 * PROTECTED ROUTES FOR ADMIN
 * ***************************************************
 */
router.post("/addDepartment", isLoggedIn, isAdmin, addDepartment);
router.get("/getAllDepartments", isLoggedIn, isAdmin, getAllDepartments); 
router.delete("/deleteDepartment/:id", isLoggedIn, isAdmin, deleteDepartment);

module.exports = router;
const express = require("express");
const router = express.Router();
const {addDepartment, getAllDepartments, deleteDepartment} = require("../controlles/department.controller");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

router.post("/department", isLoggedIn, isAdmin, addDepartment);
router.get("/department", isLoggedIn, isAdmin, getAllDepartments); 
router.delete("/department/:id", isLoggedIn, deleteDepartment);

module.exports = router;
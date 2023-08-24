const express = require("express");
const router = express.Router();
const {addDepartment, getAllDepartments, deleteDepartment} = require("../controlles/department.controller");

router.post("/department", addDepartment);
router.get("/department", getAllDepartments); 
router.delete("/department/:id", deleteDepartment);

module.exports = router;
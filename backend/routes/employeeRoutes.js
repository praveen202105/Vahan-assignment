// routes/employeeRoutes.js

const express = require('express');
const router = express.Router();
const employeeController = require("../contollers/employeeControllers")
const authenticate = require('../middlewares/authenticate');

const authorize = require('../middlewares/authorize');
const validateInput =require('../middlewares/validateInput')
const { PrismaClient } = require('@prisma/client');


router.get('/:companyId',authenticate,employeeController.getAllEmployees);
router.get('/:id', authenticate,employeeController.getEmployeeById);
router.post('/', authorize,validateInput, employeeController.createEmployee);
router.put('/:id',authorize,validateInput, employeeController.updateEmployee);
router.delete('/:id',authorize,employeeController.deleteEmployee);

module.exports = router;

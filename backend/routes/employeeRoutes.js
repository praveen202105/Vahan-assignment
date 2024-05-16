// routes/employeeRoutes.js

const express = require('express');
const router = express.Router();
const employeeController = require("../contollers/employeeControllers")
const authenticate = require('../middlewares/authenticate');

const authorize = require('../middlewares/authorize');
const { PrismaClient } = require('@prisma/client');


router.use(authenticate);

router.get('/:companyId',employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id',

employeeController.deleteEmployee);

module.exports = router;

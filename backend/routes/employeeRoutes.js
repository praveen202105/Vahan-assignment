// routes/employeeRoutes.js

const express = require('express');
const router = express.Router();
const employeeController = require("../contollers/employeeControllers")
const authenticate = require('../middlewares/authenticate');

const authorize = require('../middlewares/authorize');
const { PrismaClient } = require('@prisma/client');


// router.use(authenticate);

router.get('/', employeeController.getAllEmployees);
router.get('/:id',authorize, employeeController.getEmployeeById);
router.post('/', authorize,employeeController.createEmployee);
router.put('/:id',authorize , employeeController.updateEmployee);
router.delete('/:id', authorize, employeeController.deleteEmployee);

module.exports = router;

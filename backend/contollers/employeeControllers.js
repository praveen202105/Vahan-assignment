
const Employee = require('../models/employee');

const db = require('../confiq/database');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const employeeController = {
  getAllEmployees: async (req, res) => {
    try {
      const companyId = req.params.companyId;
      const employees = await Employee.getAll(companyId);
      res.json(employees);
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Error fetching employees' });
    }
  },
  getEmployeeById: async (req, res) => {
    const { id } = req.params;
    try {
      const employee = await db.employee.getById(id);
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching employee' });
    }
  },
  createEmployee: async (req, res) => {
  const { name, email, mobile, dob, companyId } = req.body; // Include companyId in the request body
  try {
    // Check if the email or mobile already exists for the given companyId
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        companyId,
        OR: [
          { email },
          { mobile },
        ],
      },
    });

    if (existingEmployee) {
      
      return res.status(400).json({ error: 'Email or mobile number already exists for this company' });
    }

    // Create the new employee
    const newEmployee = await Employee.create({
      name,
      email,
      mobile,
      dob: new Date(dob), // Convert to JavaScript Date object
      companyId, // Associate the employee with the specified company
    });

    res.json(newEmployee);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error creating employee' });
  }
},

  
updateEmployee: async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, dob } = req.body;
  
  try {
    // Find the employee record by id
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) }
    });
    // Retrieve the companyId of the current employee
    const companyId = employee.companyId;

   // Check if the provided email or mobile already exists for any other employee in the same companyId
    const existingEmployee = await db.employee.findFirst({
      where: {
        companyId,
        NOT: {
          id: parseInt(id) // Exclude the current employee from the search
        },
        OR: [
          { email },
          { mobile }
        ]
      }
    });

    if (existingEmployee) {
      console.log("existingEmploy")
      return res.status(400).json({ error: 'Email or mobile number already exists for this company' });
    }

    // Update the employee record
    const updatedEmployee = await Employee.update(id, { name, email, mobile, dob: new Date(dob) });
    res.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating employee' });
  }
},

  deleteEmployee: async (req, res) => {
    const { id } = req.params;
    try {
      await db.employee.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting employee' });
    }
  },
};

module.exports = employeeController;

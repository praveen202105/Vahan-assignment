
const Employee = require('../models/employee');

const employeeController = {
  getAllEmployees: async (req, res) => {
    try {
      const employees = await Employee.getAll();
      res.json(employees);
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Error fetching employees' });
    }
  },
  getEmployeeById: async (req, res) => {
    const { id } = req.params;
    try {
      const employee = await Employee.getById(id);
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching employee' });
    }
  },
  createEmployee: async (req, res) => {
    const { name, email, mobile, dob, companyId } = req.body; // Include companyId in the request body
    try {
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
      res.status(500).json({ error: 'Error creating employee' });
    }
  },
  
  updateEmployee: async (req, res) => {
    const { id } = req.params;
    const { name, email, mobile, dob } = req.body;
    const updateData = {}; 
    if (name) {
      updateData.name = name;
    }
    if (email) {
      updateData.email = email;
    }
    if (mobile) {
      updateData.mobile = mobile;
    }
    if (dob) {
      updateData.dob = new Date(dob);
    }

    try {
      const updatedEmployee = await Employee.update(id, updateData);
      res.json(updatedEmployee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating employee' });
    }
  },
  deleteEmployee: async (req, res) => {
    const { id } = req.params;
    try {
      await Employee.delete(id);
      res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting employee' });
    }
  },
};

module.exports = employeeController;

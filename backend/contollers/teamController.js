
const EmployeeModel = require('../models/employee');
const db = require('../confiq/database');

const addEmployee = async (req, res) => {
  const { employeeId } = req.body;
  const teamLeadId = req.userId;
  console.log(teamLeadId);
  try {
    const updatedEmployee = await EmployeeModel.addEmployeeToTeam(employeeId, teamLeadId);
    res.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeEmployee = async (req, res) => {
  const { employeeId } = req.body;
  const teamLeadId = req.userId;

  try {
    const updatedEmployee = await EmployeeModel.removeEmployeeFromTeam(employeeId,teamLeadId);
    res.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
   const getAllMembers = async (req, res) => {
    const { teamLeadId } = req.params;
    try {
      const teamMembers = await db.employee.findMany({
        where: { 
          teamLeadId: parseInt(teamLeadId) 
        }
      });
      res.json(teamMembers);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error fetching team members' });
    }
  };


module.exports = { addEmployee, removeEmployee ,getAllMembers};

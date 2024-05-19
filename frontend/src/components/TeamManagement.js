import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

function TeamManagement() {
  const [state, setState] = useState({
    teamMembers: [],
    allEmployees: [],
    loading: true,
    successMessage: '',
  });

  const token = Cookies.get('token');
  const decodedToken = jwtDecode(token);
  const teamLeadId = decodedToken.userId;
  const companyId = decodedToken.OrgId;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchTeamMembers();
    fetchAllEmployees(); // Fetch all employees when the component mounts
  }, []);

  const handleChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/team/allmembers/${teamLeadId}`, config); 
      handleChange('teamMembers', response.data);
      handleChange('loading', false);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/employees/${companyId}`, config); // Adjust the API endpoint as needed
      handleChange('allEmployees', response.data);
    } catch (error) {
      console.error('Error fetching all employees:', error);
    }
  };

  const handleAddMember = async (employeeId) => {
    try {
      await axios.post('http://localhost:3000/team/addEmployee', { employeeId }, config);
      handleChange('successMessage', 'Team member added successfully!');
      setTimeout(() => handleChange('successMessage', ''), 1000);
      fetchTeamMembers(); // Refresh team members after adding
      fetchAllEmployees(); // Refresh all employees after adding
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  const handleRemoveMember = async (employeeId) => {
    try {
      await axios.post('http://localhost:3000/team/removeEmployee', { employeeId }, config);
      handleChange('successMessage', 'Team member removed successfully!');
      setTimeout(() => handleChange('successMessage', ''), 1000);
      fetchTeamMembers(); // Refresh team members after removing
      fetchAllEmployees(); // Refresh all employees after removing
    } catch (error) {
      console.error('Error removing team member:', error);
    }
  };

  const renderAddButton = (employee) => {
    if (employee.teamLeadId === null) {
      return <button className="ml-4 text-green-500" onClick={() => handleAddMember(employee.id)}>Add</button>;
    } else if (employee.teamLeadId === teamLeadId) {
      return <button className="ml-4 text-red-500" onClick={() => handleRemoveMember(employee.id)}>Remove</button>;
    } else {
      return null;
    }
  };

  const renderAddButtonAllEmployee = (employee) => {
    if (employee.teamLeadId === null) {
      return <button className="ml-4 text-green-500" onClick={() => handleAddMember(employee.id)}>Add</button>;
    } else if (employee.teamLeadId !== teamLeadId) {
      return <div className="ml-4 text-gray-500">Already assigned by team lead {employee.teamLeadId}</div>;
    } else {
      return null;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4">Team Members</h3>
      {state.loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {state.successMessage && (
            <div className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg">
              {state.successMessage}
            </div>
          )}
          {state.teamMembers.length === 0 ? (
            <p className="text-gray-500">No team members found.</p>
          ) : (
            <ul className="list-disc list-inside">
              {state.teamMembers.map((member) => (
                <li key={member.id} className="mb-2">
                  {member.name} {renderAddButton(member)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <h3 className="text-2xl font-semibold mb-4 mt-6">All Employees</h3>
      <ul className="list-disc list-inside">
        {state.allEmployees.map((employee) => (
          <li key={employee.id} className="mb-2">
            {employee.name} {renderAddButtonAllEmployee(employee)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamManagement;

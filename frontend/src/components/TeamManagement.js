import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeList from './EmployeeList';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [newMemberId, setNewMemberId] = useState('');
  const [loading, setLoading] = useState(true);
  
  const token = Cookies.get('token');
  const decodedToken = jwtDecode(token);
  // console.log(decodedToken);
  const teamLeadId = decodedToken.userId;
  const companyId=decodedToken.OrgId;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchTeamMembers();
    fetchAllEmployees(); // Fetch all employees when the component mounts
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/team/allmembers/${teamLeadId}`, config); 
      setTeamMembers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      console.log(companyId);
      const response = await axios.get(`http://localhost:3000/employees/${companyId}`, config); // Adjust the API endpoint as needed
      setAllEmployees(response.data);
    } catch (error) {
      console.error('Error fetching all employees:', error);
    }
  };

  const handleAddMember = async (employeeId) => {
    try {
      await axios.post('/api/team/members', { memberId: employeeId }, config);
      fetchTeamMembers();
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  const renderAddButton = (employee) => {
    if (!employee.teamLeadId) {
      return <button onClick={() => handleAddMember(employee.id)}>Add</button>;
    } else if (employee.teamLeadId === teamLeadId) {
      return <span>Team Lead</span>;
    } else {
      return null;
    }
  };

  return (
    <div>
      <h3>Team Members</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <ul>
            {teamMembers.map((member) => (
              <li key={member.id}>
                {member.name}{' '}
                {renderAddButton(member)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <h3>All Employees</h3>
      <ul>
        {allEmployees.map((employee) => (
          <li key={employee.id}>{employee.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default TeamManagement;

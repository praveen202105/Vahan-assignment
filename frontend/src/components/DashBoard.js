import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import TeamManagement from "./TeamManagement"

function Dashboard() {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { 
    const fetchUserRole = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          navigate('/login');
          return;
        }
        console.log(token)
        const decodedToken = jwtDecode(token);
        console.log(decodedToken)
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        navigate('/login');
      }
    };

    fetchUserRole();
  }, [navigate]);

  if (!userRole) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      {userRole === 'OWNER' && (
        <div>
          <h3>Owner Actions</h3>
          <EmployeeList />
          {/* Add other owner-specific components or actions here */}
        </div>
      )}
      {userRole === 'TEAM_LEAD' && (
        <div>
          <h3>Team Lead Actions</h3>
          <TeamManagement />
          {/* Add other team lead-specific components or actions here */}
        </div>
      )}
      {userRole !== 'OWNER' && userRole !== 'TEAM_LEAD' && (
        <div>
          <h3>General User Actions</h3>
          {/* Add general user-specific components or actions here */}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

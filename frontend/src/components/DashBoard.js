import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import OwnerActions from './OwnerActions';
import TeamManagement from './TeamManagement';

function Dashboard() {
  const [userRole, setUserRole] = useState(null);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        navigate('/login');
      }
    };

    fetchUserRole();
  }, [navigate]);

  const handleLogout = () => {
   
    setLogoutSuccess(true);
    setTimeout(() => {
      navigate('/login');
      Cookies.remove('token');
    }, 2000);
  };

  if (!userRole) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      {logoutSuccess && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md">
          Successfully logged out!
        </div>
      )}
      {userRole === 'OWNER' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-semibold mb-4">Owner Actions</h3>
          <OwnerActions />
        </div>
      )}
      {userRole === 'TEAM_LEAD' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-semibold mb-4">Team Lead Actions</h3>
          <TeamManagement />
        </div>
      )}
    </div>
  );
}

export default Dashboard;

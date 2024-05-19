import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/Login';
import './App.css';
import Dashboard from './components/DashBoard';
import Cookies from 'js-cookie';
import OwnerActions from './components/OwnerActions';
import NotFound from './components/NotFound';

function App() {
  const token = Cookies.get('token');
  const isLoggedIn = !!token; // Convert token to boolean to check if user is logged in

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/register" element={<RegisterForm />} />
          <Route exact path="/login" element={<LoginForm />} />
          {isLoggedIn ? (
            <Route path="/" element={<Navigate to="/dashboard" />} />
          ) : (
            <Route path="/" element={<Navigate to="/login" />} />
          )}
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/employees/:companyId" element={<OwnerActions />} />
         
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/Login';
import './App.css';
import EmployeeList from './components/EmployeeList';
import Dashboard from './components/DashBoard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/register" element={<RegisterForm />} />
          <Route exact path="/login" element={<LoginForm />} />
          <Route exact path="/dashboard" element={<Dashboard/>} />
          
          <Route
            exact
            path="/employees/:companyId"
            element={<EmployeeList />}
          />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

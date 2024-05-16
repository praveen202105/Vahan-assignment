import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import EmployeeForm from './EmployeeForm';
import {jwtDecode } from "jwt-decode";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { companyId } = useParams();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = Cookies.get('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const decodedToken = jwtDecode(token);
        const companyId =decodedToken.userId;
       
        const response = await axios.get(`http://localhost:3000/employees/${companyId}}`, config);
        setEmployees(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmployees();
  }, [companyId]);

  const handleAddEmployee = () => {
    setShowForm(true);
    setFormMode('add');
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
    setFormMode('edit');
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedEmployee(null);
  };

  const handleSubmitForm = async (formData) => {
    const token = Cookies.get('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (formMode === 'add') {
      try {
        formData.companyId = parseInt(companyId);

        // Send a POST request to create a new employee
        const response = await axios.post('http://localhost:3000/employees', formData, config);
        
        // Add the newly created employee to the list
        setEmployees([...employees, response.data]);

        // Close the form
        handleCloseForm();
      } catch (error) {
        alert(error.response.data.error)
        console.error('Error adding employee:', error.response.data.error);
      }
    } else if (formMode === 'edit') {
      try {
        // Send a PUT request to update the employee
        const response = await axios.put(`http://localhost:3000/employees/${selectedEmployee.id}`, formData, config);

        // Update the employee in the list
        const updatedEmployees = employees.map(emp => {
          if (emp.id === selectedEmployee.id) {
            return response.data;
          } else {
            return emp;
          }
        });

        setEmployees(updatedEmployees);

        // Close the form
        handleCloseForm();
      } catch (error) {
        alert(error.response.data.error)
        console.error('Error editing employee:', error);
      }
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    const token = Cookies.get('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // Send a DELETE request to delete the employee
      await axios.delete(`http://localhost:3000/employees/${employeeId}`, config);

      // Remove the deleted employee from the list
      setEmployees(employees.filter(employee => employee.id !== employeeId));
    } catch (error) {
      alert(error.response.data.error)
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div>
      <h2>Employees</h2>
      <button onClick={handleAddEmployee}>Add Employee</button>
      {showForm && (
        <EmployeeForm
          mode={formMode}
          employeeData={selectedEmployee}
          onSubmit={handleSubmitForm}
          onClose={handleCloseForm}
        />
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Date of Birth</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.mobile}</td> {/* Display mobile number */}
              <td>{new Date(employee.dob).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEditEmployee(employee)}>Edit</button>
                <button onClick={() => handleDeleteEmployee(employee.id)}>Delete</button> {/* Add delete button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;

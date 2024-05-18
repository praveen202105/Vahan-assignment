import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import EmployeeForm from './EmployeeForm';

function OwnerActions() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const token = Cookies.get('token');
  const decodedToken = jwtDecode(token);
  const companyId = decodedToken.userId;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`http://localhost:3000/employees/${companyId}`, config);
        setEmployees(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmployees();
  }, [companyId, token]);

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
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (formMode === 'add') {
      try {
        formData.companyId = parseInt(companyId);

        const response = await axios.post('http://localhost:3000/employees', formData, config);

        if (response.status === 200) {
          setSuccess(true);
        }
        setTimeout(() => {
          setSuccess(false);
          handleCloseForm();
          setEmployees([...employees, response.data]);
        }, 1000);
      } catch (error) {
        setErrorMessage(error.response.data.error);
        setTimeout(() => {
          setErrorMessage('');
        }, 2000);
        console.log(error.response.data.error);
      }
    } else if (formMode === 'edit') {
      try {
        const response = await axios.put(`http://localhost:3000/employees/${selectedEmployee.id}`, formData, config);

        const updatedEmployees = employees.map((emp) => {
          if (emp.id === selectedEmployee.id) {
            return response.data;
          } else {
            return emp;
          }
        });

        if (response.status === 200) {
          setSuccess(true);
        }
        setTimeout(() => {
          handleCloseForm();
          setSuccess(false);
          setEmployees(updatedEmployees);
        }, 1000);
      } catch (error) {
        setErrorMessage(error.response.data.error);
        setTimeout(() => {
          setErrorMessage('');
        }, 2000);
        console.error('Error editing employee:', error);
      }
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.delete(`http://localhost:3000/employees/${employeeId}`, config);

      setEmployees(employees.filter((employee) => employee.id !== employeeId));
      setDeleteSuccess(true);
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 1000);
    } catch (error) {
      alert(error.response.data.error);
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Employees</h2>
      <button
        onClick={handleAddEmployee}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add Employee
      </button>
      {showForm && (
        <EmployeeForm
          mode={formMode}
          employeeData={selectedEmployee}
          onSubmit={handleSubmitForm}
          onClose={handleCloseForm}
          success={success}
          errormsg={errorMessage}
        />
      )}
      {deleteSuccess && (
        <div className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg">
          Employee deleted successfully!
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Mobile</th>
              <th className="px-4 py-2">Date of Birth</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="border px-4 py-2">{employee.name}</td>
                <td className="border px-4 py-2">{employee.email}</td>
                <td className="border px-4 py-2">{employee.mobile}</td>
                <td className="border px-4 py-2">{new Date(employee.dob).toLocaleDateString()}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEditEmployee(employee)}
                    className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OwnerActions;

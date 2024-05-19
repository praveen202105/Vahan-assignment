import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import EmployeeForm from './EmployeeForm';

function OwnerActions() {
  const [state, setState] = useState({
    employees: [],
    showForm: false,
    formMode: 'add',
    success: false,
    errorMessage: '',
    selectedEmployee: null,
    deleteSuccess: false,
  });

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
        setState((prevState) => ({
          ...prevState,
          employees: response.data,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmployees();
  }, [companyId, token]);

  const handleChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddEmployee = () => {
    handleChange('showForm', true);
    handleChange('formMode', 'add');
  };

  const handleEditEmployee = (employee) => {
    handleChange('selectedEmployee', employee);
    handleChange('showForm', true);
    handleChange('formMode', 'edit');
  };

  const handleCloseForm = () => {
    handleChange('showForm', false);
    handleChange('selectedEmployee', null);
  };

  const handleSubmitForm = async (formData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (state.formMode === 'add') {
      try {
        formData.companyId = parseInt(companyId);

        const response = await axios.post('http://localhost:3000/employees', formData, config);

        if (response.status === 200) {
          handleChange('success', true);
        }
        setTimeout(() => {
          handleChange('success', false);
          handleCloseForm();
          handleChange('employees', [...state.employees, response.data]);
        }, 1000);
      } catch (error) {
        handleChange('errorMessage', error.response.data.error);
        setTimeout(() => {
          handleChange('errorMessage', '');
        }, 2000);
        console.log(error.response.data.error);
      }
    } else if (state.formMode === 'edit') {
      try {
        const response = await axios.put(`http://localhost:3000/employees/${state.selectedEmployee.id}`, formData, config);

        const updatedEmployees = state.employees.map((emp) => {
          if (emp.id === state.selectedEmployee.id) {
            return response.data;
          } else {
            return emp;
          }
        });

        if (response.status === 200) {
          handleChange('success', true);
        }
        setTimeout(() => {
          handleCloseForm();
          handleChange('success', false);
          handleChange('employees', updatedEmployees);
        }, 1000);
      } catch (error) {
        handleChange('errorMessage', error.response.data.error);
        setTimeout(() => {
          handleChange('errorMessage', '');
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

      handleChange('employees', state.employees.filter((employee) => employee.id !== employeeId));
      handleChange('deleteSuccess', true);
      setTimeout(() => {
        handleChange('deleteSuccess', false);
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
      {state.showForm && (
        <EmployeeForm
          mode={state.formMode}
          employeeData={state.selectedEmployee}
          onSubmit={handleSubmitForm}
          onClose={handleCloseForm}
          success={state.success}
          errormsg={state.errorMessage}
        />
      )}
      {state.deleteSuccess && (
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
            {state.employees.map((employee) => (
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

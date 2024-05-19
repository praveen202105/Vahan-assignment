// AllEmployees.js

import React from 'react';

const AllEmployees = ({ employees, renderAddButton }) => {
    // console.log(employees)
  return (
    <ul>
      {employees.map((employee) => (
        <li key={employee.id}>
          {employee} {employee.id }{employee.teamLeadId 
          ? null :renderAddButton(employee)
            }
        </li>
      ))}
    </ul>
  );
}

export default AllEmployees;

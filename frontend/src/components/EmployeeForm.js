import React, { useState, useEffect } from 'react';

function EmployeeForm({ mode, employeeData, onSubmit, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState(''); // Add dob state

  useEffect(() => {
    if (mode === 'edit' && employeeData) {
      setName(employeeData.name);
      setEmail(employeeData.email);
      setMobile(employeeData.mobile);
      setDob(employeeData.dob); // Set dob if available
    }
  }, [mode, employeeData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, mobile, dob });
    onClose();
  };

  return (
    <div className="popup-form">
      <h2>{mode === 'add' ? 'Add Employee' : 'Edit Employee'}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        <br /><br />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br /><br />
        <label htmlFor="mobile">Mobile:</label>
        <input type="text" id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
        <br /><br />
        <label htmlFor="dob">Date of Birth:</label>
        <input type="date" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} required />
        <br /><br />
        <button type="submit">{mode === 'add' ? 'Add' : 'Save'}</button>
        <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>Close</button> {/* Add close button */}
      </form>
    </div>
  );
}

export default EmployeeForm;

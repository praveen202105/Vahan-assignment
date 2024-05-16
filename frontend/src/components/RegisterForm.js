import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm() {
  const [role, setRole] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/auth/register', {
        email,
        password,
        role,
        organizationName: role === 'OWNER' ? organizationName : undefined,
        organizationId: role === 'TEAM_LEAD' ? organizationId : undefined,
      });

      // Reset form fields after successful submission
      setRole('');
      setOrganizationName('');
      setOrganizationId('');
      setEmail('');
      setPassword('');
      
      console.log(res.status);
      // Check if token is present in response
      if (res.status === 200) {
        // Show registration success alert
        setRegistrationSuccess(true);
      }
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br /><br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br /><br />
        <label htmlFor="role">Select Role:</label>
        <select id="role" value={role} onChange={handleRoleChange}>
          <option value="">Select Role</option>
          <option value="OWNER">Owner</option>
          <option value="TEAM_LEAD">Team Leader</option>
        </select>
        <br /><br />
        {role === 'OWNER' &&
          <div>
            <label htmlFor="organizationName">Organization Name:</label>
            <input type="text" id="organizationName" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} />
            <br /><br />
          </div>
        }
        {role === 'TEAM_LEAD' &&
          <div>
            <label htmlFor="organizationId">Company ID:</label>
            <input type="text" id="organizationId" value={organizationId} onChange={(e) => setOrganizationId(e.target.value)} />
            <br /><br />
          </div>
        }
        <button type="submit">Register</button>
      </form>
      {registrationSuccess && (
        <div className="success-alert">Registration successful!</div>
      )}
    </div>
  );
}

export default RegisterForm;

// index.js

const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const teamsRoutes = require('./routes/teamRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/employees', employeeRoutes);
app.use('teams', teamsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

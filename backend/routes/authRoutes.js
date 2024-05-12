

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secretKey, expiresIn } = require('../confiq/jwt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
    const { email, password, role, organizationName, OrganizationId } = req.body;

    try {
        // Check if user with the provided email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Ensure that organization details are provided based on the role
        if (role === 'OWNER' && !organizationName) {
            return res.status(400).json({ error: 'Organization name is required for owner role' });
        }

        if (role === 'TEAM_LEAD' && !OrganizationId) {
            return res.status(400).json({ error: 'Organization ID is required for team lead role' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the organization and user
        const userData = {
            email,
            password: hashedPassword,
            role,
            Organization: role === 'OWNER' ? organizationName : undefined, // Set organization name based on role
            OrganizationId: role === 'TEAM_LEAD' ? OrganizationId : undefined, // Set organization id based on role
        };

        const user = await prisma.user.create({
            data: userData,
        });

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn });

        res.json({ token, role ,user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user with the provided email exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn });

    res.json({ token, role: user.role ,user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;



const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secretKey, expiresIn } = require('../confiq/jwt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  const { email, password, role, organizationName, organizationId } = req.body;

  try {
    const normalizedEmail = email.toLowerCase() ;

      // Check if user with the provided email already exists
      const existingUser = await prisma.user.findUnique({ where: { email:normalizedEmail} });
      if (existingUser) {
          return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Ensure that organization details are provided based on the role
      if (role === 'OWNER' && !organizationName) {
          return res.status(400).json({ error: 'Organization name is required for owner role' });
      }

      if (role === 'TEAM_LEAD' && !organizationId) {
          return res.status(400).json({ error: 'Company ID is required for Team Lead role' });
      }

       // Normalize the organization name for case-insensitive comparison
       const normalizedOrgName = organizationName ? organizationName.toLowerCase() : null;
       
      // Check if organization name already exists for OWNER role
      if (role === 'OWNER') {
          const existingOrganization = await prisma.user.findUnique({ where: { Organization:normalizedOrgName } });
          if (existingOrganization) {
              return res.status(400).json({ error: 'Organization with this name already exists' });
          }
      }

      // Check if organization ID exists for TEAM_LEAD role
      if (role === 'TEAM_LEAD') {
          const existingOrganization = await prisma.user.findUnique({ where: { id: parseInt(organizationId) } });
          if (!existingOrganization) {
              return res.status(400).json({ error: 'Organization not found' });
          }
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

     

      const userData = {
        email:normalizedEmail,
        password: hashedPassword,
        role,
        Organization: role === 'OWNER' ? normalizedOrgName : undefined, // Set organization name based on role
        OrganizationId: role === 'TEAM_LEAD' ? organizationId : undefined, // Set organization id based on role
    };


      const user = await prisma.user.create({
          data: userData,
      });

      // Generate JWT token
      const token = jwt.sign(
          { OrgId: user.OrganizationId, userId: user.id, role: user.role },
          secretKey,
          { expiresIn }
      );

      res.json({ token, role, user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});




router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // console.log("Called login")
  try {
    // Check if user with the provided email exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'E-mail does not find' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Wrong Password' });
    }
  // console.log(user)
    // Generate JWT token
    const token = jwt.sign({OrgId:user.OrganizationId, userId: user.id ,role: user.role}, secretKey, { expiresIn });

    res.json({ token:token, role: user.role ,user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

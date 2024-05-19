const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const findOrganizationById = async (organizationId) => {
  return prisma.user.findUnique({ where: { id: parseInt(organizationId) } });
};

const findOrganizationByName = async (organizationName) => {
  return prisma.user.findUnique({ where: { Organization: organizationName.toLowerCase() } });
};

const createUser = async (userData) => {
  return prisma.user.create({ data: userData });
};

module.exports = {
  findUserByEmail,
  findOrganizationById,
  findOrganizationByName,
  createUser,
};



const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const db = require('../confiq/database');

const addEmployeeToTeam = async (employeeId, teamLeadId) => {
  try {
    const existingEmployee = await prisma.employee.findFirst({
      where: { id: employeeId, teamLeadId: { not: null } },
    });
    if (existingEmployee) {
      throw new Error('Employee is already assigned to a team');
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: { teamLeadId },
    });

    return updatedEmployee;
  } catch (error) {
    throw error;
  }
};

const removeEmployeeFromTeam = async (employeeId, teamLeadId) => {
  try {
    // Verify if the authenticated user is the team lead who assigned the employee
    const assignedEmployee = await prisma.employee.findFirst({
      where: { id: employeeId, teamLeadId: teamLeadId },
    });

    if (!assignedEmployee) {
      throw new Error('You are not authorized to remove this employee from the team.');
    }

    // If authorized, remove the employee from the team
    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: { teamLeadId: null },
    });

    return updatedEmployee;
  } catch (error) {
    throw error;
  }
};


const Employee = {
  getAll: async () => {
    try {
      return await db.employee.findMany();
    } catch (error) {
      throw error;
    }
  },
  getById: async (id) => {
    try {
      return await db.employee.findUnique({
        where: {
          id: parseInt(id),
        },
      });
    } catch (error) {
      throw error;
    }
  },
  create: async (data) => {
    try {
      return await db.employee.create({
        data,
      });
    } catch (error) {
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      return await db.employee.update({
        where: {
          id: parseInt(id),
        },
        data,
      });
    } catch (error) {
      throw error;
    }
  },
  delete: async (id) => {
    try {
      return await db.employee.delete({
        where: {
          id: parseInt(id),
        },
      });
    } catch (error) {
      throw error;
    }
  },
};

module.exports = { addEmployeeToTeam, removeEmployeeFromTeam, ...Employee };

const express = require('express');
const { Employee } = require('../models');
const { auth } = require('./authRoutes');
const router = express.Router();

// Create employee
router.post('/', auth, async (req, res) => {
  try {
    const {
      fullNameEn,
      fullNameLocal,
      positionTitleEn,
      positionTitleLocal,
      idNumber,
      phone,
      issueDate,
      expiryDate,
      photo, // base64 string
    } = req.body;

    // Validate required fields
    if (!fullNameEn || !fullNameLocal || !positionTitleEn || !positionTitleLocal ||
        !idNumber || !phone || !issueDate || !expiryDate || !photo) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const employee = await Employee.create({
      fullNameEn,
      fullNameLocal,
      positionTitleEn,
      positionTitleLocal,
      idNumber,
      phone,
      issueDate,
      expiryDate,
      photo,
    });

    res.status(201).json(employee);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'ID Number already exists' });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get all employees
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk create employees
router.post('/bulk', auth, async (req, res) => {
  try {
    const employeesData = req.body; // Array of employee objects

    if (!Array.isArray(employeesData)) {
      return res.status(400).json({ error: 'Data must be an array' });
    }

    const createdEmployees = await Employee.bulkCreate(employeesData, {
      validate: true,
      ignoreDuplicates: false // We want to know if there are duplicates
    });

    res.status(201).json(createdEmployees);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'One or more ID Numbers already exist' });
    } else if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ error: 'Validation failed: ' + error.errors.map(e => e.message).join(', ') });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  }
});

// Bulk delete employees
router.delete('/bulk', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of IDs to delete' });
    }

    await Employee.destroy({
      where: {
        id: ids
      }
    });

    res.json({ message: `${ids.length} employees deleted successfully` });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

// Update employee
router.put('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const {
      fullNameEn,
      fullNameLocal,
      positionTitleEn,
      positionTitleLocal,
      idNumber,
      phone,
      issueDate,
      expiryDate,
      photo,
    } = req.body;

    await employee.update({
      fullNameEn,
      fullNameLocal,
      positionTitleEn,
      positionTitleLocal,
      idNumber,
      phone,
      issueDate,
      expiryDate,
      photo,
    });

    res.json(employee);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'ID Number already exists' });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Delete employee
router.delete('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await employee.destroy();
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
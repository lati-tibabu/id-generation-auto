const express = require('express');
const { Analytics, Employee, sequelize } = require('../models');
const { auth } = require('./authRoutes');
const { Op } = require('sequelize');
const router = express.Router();

// Track an event (public or private depending on type)
router.post('/track', async (req, res) => {
  try {
    const { type, employeeId } = req.body;
    if (!type) {
      return res.status(400).json({ error: 'Event type is required' });
    }

    await Analytics.create({
      type,
      employeeId: employeeId || null,
    });

    res.status(201).json({ message: 'Event tracked' });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get analytics data (auth required)
router.get('/stats', auth, async (req, res) => {
  try {
    const totalEmployees = await Employee.count();

    // Helper to get count by type and time range
    const getCount = async (type, startDate) => {
      const where = { type };
      if (startDate) {
        where.timestamp = { [Op.gte]: startDate };
      }
      return await Analytics.count({ where });
    };

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(new Date().setDate(new Date().getDate() - 7));
    const monthStart = new Date(new Date().setMonth(new Date().getMonth() - 1));

    const stats = {
      employees: {
        total: totalEmployees,
      },
      downloads: {
        total: await Analytics.count({ 
          where: { 
            type: { [Op.like]: 'download_%' } 
          } 
        }),
        today: await Analytics.count({ 
          where: { 
            type: { [Op.like]: 'download_%' },
            timestamp: { [Op.gte]: todayStart }
          } 
        }),
      },
      verifications: {
        total: await getCount('verification'),
        today: await getCount('verification', todayStart),
        week: await getCount('verification', weekStart),
        month: await getCount('verification', monthStart),
      },
      recentActivity: await Analytics.findAll({
        limit: 10,
        order: [['timestamp', 'DESC']],
        include: [{
          model: Employee,
          attributes: ['fullNameEn', 'idNumber']
        }]
      })
    };

    res.json(stats);
  } catch (error) {
    console.error('Analytics stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

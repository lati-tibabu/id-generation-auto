const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { sequelize, User } = require('./models');
const employeeRoutes = require('./routes/employeeRoutes');
const { router: authRoutes, auth } = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  // origin: ['http://172.10.11.211:5173'], // your frontend
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173'], // your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // For base64 images
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime() 
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

// Database sync and seeding
sequelize.sync()
  .then(async () => {
    console.log('Database connected and synced');
    
    // Seed admin user
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin user seeded');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });
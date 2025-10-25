const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const blockRoutes = require('./routes/blocks');
const floorRoutes = require('./routes/floors');
const classroomRoutes = require('./routes/classrooms');
const studentRoutes = require('./routes/students');
const examRoutes = require('./routes/exams');
const seatPlanRoutes = require('./routes/seatPlans');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? `https://uniseat.netlify.app` 
    : 'http://localhost:5173',
  credentials: true
}));

// Routes


app.use('/api/auth', authRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/floors', floorRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/exams', seatPlanRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'UniSeat API is running',
    timestamp: new Date().toISOString()
  });
});

app.get("/",(req,res)=>{
  res.send("working");
})

// Error handler middleware (must be last)
app.use(errorHandler);

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 UniSeat Backend Server running on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  // console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  // console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

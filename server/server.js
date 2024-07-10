const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');

dotenv.config();

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Environment variable ${envVar} is not set`);
    process.exit(1);
  }
}

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
  optionsSuccessStatus: 204,
};

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true, // Enable CORS for credentials
  },
});

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware for logging requests
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Middleware for parsing JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Define Routes
const authRoutes = require('./routes/auth');
const whiteboardRoutes = require('./routes/whiteboard');

app.use('/api/auth', authRoutes);
app.use('/api/whiteboard', whiteboardRoutes);

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

app.use((err, req, res, next) => {
  console.error('Error details:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong on the server'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource does not exist' });
});

// Initialize Socket.IO
require('./socket')(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

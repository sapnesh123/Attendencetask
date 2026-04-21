// server.js
import express from 'express';
import dotenv from 'dotenv';
import router from './routes.js';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import logger from './helpers/logger.js';

// ─── Configure dotenv FIRST ─────────────────────────────────────────────────
dotenv.config();
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Create required directories ─────────────────────────────────────────────────
const uploadDir = './uploads';
const logsDir = './logs';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}



// ─── Multer setup ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
global.upload = upload;

const app = express();




app.use(cors({
  origin: (origin, callback) => {
    // Allow local development and specific deployed URLs
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3002",
      "https://hrms-pannel.onrender.com",
      "https://attendencetask.onrender.com",
      // User's likely Vercel URL based on context
    ];

    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));


// ─── Body / cookie parsers ───────────────────────────────────────────────────
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

// ─── Static uploads ──────────────────────────────────────────────────────────
app.use('/uploads', express.static('uploads'));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', router);

// ─── Serve Frontend (Production) ─────────────────────────────────────────────
// ─── Serve Frontend (Production) ─────────────────────────────────────────────
const possibleBuildPaths = [
  path.join(process.cwd(), '../admin/build'),
  path.join(process.cwd(), './admin/build'),
  path.join(process.cwd(), 'admin/build'),
  path.join(__dirname, '../admin/build')
];

let adminBuildPath = possibleBuildPaths.find(p => fs.existsSync(p));

if (adminBuildPath) {
  logger.info(`Serving admin frontend from: ${adminBuildPath}`);
  app.use(express.static(adminBuildPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
      return res.sendFile(path.join(adminBuildPath, 'index.html'));
    }
    next();
  });
} else {
  logger.warn('Admin build folder not found. SPA routing may not work.');
}

// ─── MongoDB ──────────────────────────────────────────────────────────────────
const mongodb = async () => {
  try {
    await mongoose.connect(process.env.DBPATH);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
  }
};
mongodb();

// ─── Start Server ─────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server started successfully on port ${PORT}`);
      // console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
    });
  } catch (error) {
    logger.error('Server start error:', error);
  }
};

startServer();
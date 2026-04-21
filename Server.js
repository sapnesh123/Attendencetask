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

// ─── Create required directories ─────────────────────────────────────────────────
const uploadDir = './uploads';
const logsDir = './logs';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// ─── Allowed Origins ─────────────────────────────────────────────────────────
// const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://hrms-pannel.onrender.com,http://localhost:3002,http://localhost:5173,http://localhost:3009,http://127.0.0.1:3009')
//   .split(',')
//   .map((o) => o.trim());

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

// const corsOptions = {
//   origin: (origin, callback) => {
//     // Allow requests with no origin (e.g. mobile apps, Postman, server-to-server)
//     if (!origin) return callback(null, true);
//     if (ALLOWED_ORIGINS.includes(origin)) {
//       return callback(null, true);
//     }
//     return callback(new Error(`CORS: Origin ${origin} not allowed`));
//   },
//   credentials: true,                        // required for cookies
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'accesstoken'],
//   exposedHeaders: ['Set-Cookie'],
// };



app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://hrms-pannel.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
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
      console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
    });
  } catch (error) {
    logger.error('Server start error:', error);
  }
};

startServer();
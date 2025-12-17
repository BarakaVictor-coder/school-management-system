const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   ✅ CORS — MUST BE FIRST
========================= */

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://schoolmanagementsystemfrontend.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow server-to-server / curl / postman
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // IMPORTANT: allow but don't crash
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


/* =========================
   Security & Parsers
========================= */

app.use(helmet({
    crossOriginResourcePolicy: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   Rate Limiting (AFTER CORS)
========================= */

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);

/* =========================
   Database
========================= */

connectDB();

/* =========================
   Routes
========================= */

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/approvals', require('./routes/approvalRoutes'));
app.use('/api/parents', require('./routes/parentRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/grades', require('./routes/gradeRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));

/* =========================
   Root
========================= */

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

/* =========================
   Error Handler
========================= */

app.use((err, req, res, next) => {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

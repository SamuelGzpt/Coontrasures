const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const API_SECRET = process.env.JWT_SECRET || 'mock-token-secure';

// --- Security Middleware ---

// Helmet sets various HTTP headers for security
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Global Rate Limiting: Prevent brute-force and DoS
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(globalLimiter);

// Specific Login Rate Limiter (Stricter)
const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 login attempts per hour
    message: 'Too many login attempts, please try again later.'
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

    // In a real app, verify JWT signature here
    if (token !== API_SECRET) {
        return res.status(403).json({ message: 'Access Denied: Invalid Token' });
    }

    next();
};

// Parse JSON bodies
app.use(express.json());

// --- File Upload Configuration (Multer) ---

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Sanitize filename and append unique timestamp to prevent collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'report-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only .pdf format allowed!'));
        }
    }
});

// Serve uploaded files statically
// Note: In a high security app, you might want to authenticate this route too
app.use('/uploads', express.static(uploadDir));

// --- Mock Database (In-Memory) for now ---
let reports = [
    // Example: { id: '1', name: 'Informe 2024.pdf', date: '2024-01-20', url: '/uploads/example.pdf' }
];

// --- Routes ---

// GET /api/reports: Public
app.get('/api/reports', (req, res) => {
    res.json(reports);
});

// POST /api/login: Admin Check with Strict Rate Limit
app.post('/api/login', loginLimiter, (req, res) => {
    const { password } = req.body;

    // Check against env variable
    if (password === (process.env.ADMIN_PASSWORD || 'admin123')) {
        res.json({ success: true, token: API_SECRET });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// POST /api/reports: Protected Upload
app.post('/api/reports', authenticateToken, upload.single('report'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded or invalid file type.');
        }

        const newReport = {
            id: crypto.randomUUID(),
            name: req.file.originalname,
            date: new Date().toLocaleDateString(),
            // URL to access the file
            url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        };

        reports.unshift(newReport);
        res.json(newReport);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// DELETE /api/reports/:id: Protected
app.delete('/api/reports/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const reportIndex = reports.findIndex(r => r.id === id);

    if (reportIndex > -1) {
        const report = reports[reportIndex];
        // Optional: Delete file from disk
        const filename = report.url.split('/').pop();
        const filePath = path.join(uploadDir, filename);

        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error('Error deleting file:', err);
            }
        }

        reports.splice(reportIndex, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Report not found' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running secure on port ${PORT}`);
    console.log(`Allowed Client URL: ${CLIENT_URL}`);
});

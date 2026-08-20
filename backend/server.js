const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const pool = require("./config/db");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const personalRoutes = require("./routes/personalRoutes");
const educationRoutes = require("./routes/educationRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const skillsRoutes = require("./routes/skillsRoutes");
const projectsRoutes = require("./routes/projectsRoutes");
const certificationsRoutes = require("./routes/certificationsRoutes");
const resumepreviewRoutes = require("./routes/resumepreviewRoutes");
const TemplatesRoutes = require("./routes/templatesRoutes");
const atsRoutes = require("./routes/atsRoutes");
const jobMatchRoutes = require("./routes/jobMatchRoutes");

const app = express();

// Security Headers (disable CSP for inline script support)
app.use(helmet({
    contentSecurityPolicy: false
}));

// Logging Middleware
if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
} else {
    app.use(morgan("dev"));
}

// Production-ready CORS setup
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:5173",
    "http://localhost:5500",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:5500"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
            return callback(null, true);
        }
        if (!process.env.FRONTEND_URL || process.env.FRONTEND_URL === "*") {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// Register Routes
app.use("/api", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/personal", personalRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/certifications", certificationsRoutes);
app.use("/api/resume/preview", resumepreviewRoutes);
app.use("/api/templates", TemplatesRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/job-match", jobMatchRoutes);

app.get("/", async (req, res, next) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            success: true,
            message: "Resume Builder Backend Running",
            database_time: result.rows[0].now
        });
    } catch (err) {
        next(err);
    }
});

// Health check endpoint
app.get("/health", async (req, res, next) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.status(200).json({
            status: "UP",
            timestamp: new Date(),
            database: "CONNECTED",
            database_time: result.rows[0].now,
            uptime: process.uptime()
        });
    } catch (err) {
        next(err);
    }
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(`[Error Log] ${err.message}`);
    if (err.stack && process.env.NODE_ENV !== "production") {
        console.error(err.stack);
    }

    const statusCode = err.statusCode || 500;
    const response = {
        success: false,
        message: err.message || "Internal Server Error"
    };

    if (process.env.NODE_ENV !== "production") {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
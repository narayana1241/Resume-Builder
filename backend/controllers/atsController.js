const pool = require("../config/db");

/**
 * Recalculate ATS score for a specific resume
 */
const analyzeAtsScore = async (req, res) => {
    try {
        const { resume_id } = req.body;
        
        if (!resume_id) {
            return res.status(400).json({
                success: false,
                message: "resume_id is required"
            });
        }

        const result = await pool.query(
            "SELECT public.calculate_ats_score($1) as score_data",
            [resume_id]
        );

        res.status(200).json({
            success: true,
            message: "ATS Score calculated successfully",
            data: result.rows[0].score_data
        });
    } catch (err) {
        console.error("Analyze ATS Score Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * Fetch consolidated dashboard metrics for a resume
 */
const getAtsDashboard = async (req, res) => {
    try {
        const { resume_id } = req.params;

        if (!resume_id) {
            return res.status(400).json({
                success: false,
                message: "resume_id is required in params"
            });
        }

        const result = await pool.query(
            "SELECT public.get_ats_dashboard($1) as dashboard_data",
            [resume_id]
        );

        res.status(200).json({
            success: true,
            data: result.rows[0].dashboard_data
        });
    } catch (err) {
        console.error("Get ATS Dashboard Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * Generate and download ATS report data
 */
const downloadAtsReport = async (req, res) => {
    try {
        const { resume_id } = req.params;

        if (!resume_id) {
            return res.status(400).json({
                success: false,
                message: "resume_id is required"
            });
        }

        const result = await pool.query(
            "SELECT public.download_ats_report($1) as report_data",
            [resume_id]
        );

        res.status(200).json({
            success: true,
            data: result.rows[0].report_data
        });
    } catch (err) {
        console.error("Download ATS Report Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    analyzeAtsScore,
    getAtsDashboard,
    downloadAtsReport
};

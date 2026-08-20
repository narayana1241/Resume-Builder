const pool = require("../config/db");

const analyzeJobMatch = async (req, res) => {
    try {
        const { user_id, resume_id, job_title, company_name, job_url, job_description_text } = req.body;
        if (!resume_id || !job_description_text) {
            return res.status(400).json({ error: "Missing required resume_id or job_description_text" });
        }
        const jobRes = await pool.query(
            "SELECT public.save_job_description($1, $2, $3, $4, $5) as job_id",
            [user_id || 1, job_title || "Job Application", company_name || "Company", job_url || "", job_description_text]
        );
        const jobId = jobRes.rows[0].job_id;
        const matchRes = await pool.query(
            "SELECT public.calculate_resume_job_match($1, $2) as analysis",
            [resume_id, jobId]
        );
        res.json(matchRes.rows[0].analysis);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const fetchJobUrl = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ error: "URL is required" });
        const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (!response.ok) throw new Error("Fetch failed");
        const html = await response.text();
        const cleanText = html
            .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
            .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        res.json({ text: cleanText.substring(0, 8000) });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch job description from URL. Please copy and paste instead." });
    }
};

module.exports = {
    analyzeJobMatch,
    fetchJobUrl
};

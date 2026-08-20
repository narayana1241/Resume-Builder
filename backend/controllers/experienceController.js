const pool = require("../config/db");
const { ensureTableColumns } = require("../utils/dynamicSchema");

const saveExperience = async (req, res) => {
    const client = await pool.connect();
    try {
        await ensureTableColumns(client, "resume_experience", req.body);

        const {
            resume_id,
            company_name,
            job_title,
            employment_type,
            location,
            start_date,
            end_date,
            currently_working,
            job_description
        } = req.body;

        const cleanStartDate = (start_date && start_date !== "" && start_date !== "null") ? start_date : "2023-01-01";
        const cleanEndDate = (end_date && end_date !== "" && end_date !== "null") ? end_date : null;

        const payloadObj = {
            experience_id: null,
            resume_id,
            company_name: company_name || "Company",
            job_title: job_title || "Software Engineer",
            employment_type: employment_type || "Full-time",
            location: location || "Remote",
            start_date: cleanStartDate,
            end_date: cleanEndDate,
            currently_working: currently_working ? true : false,
            job_description: job_description || "",
            record_status: 1,
            ...req.body
        };

        const jsonData = JSON.stringify([payloadObj]);

        await client.query("BEGIN");

        const cursorResult = await client.query(
            "SELECT * FROM public.upr_insupd_hr_resume_experience_json($1,$2)",
            [jsonData, 1]
        );

        const cursorName = cursorResult.rows[0].p_refcur;
        const result = await client.query(
            `FETCH ALL IN "${cursorName}"`
        );

        await client.query("COMMIT");
        res.json(result.rows[0]);
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("saveExperience Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    } finally {
        client.release();
    }
};

const deleteExperience = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM resume_experience WHERE experience_id = $1", [id]);
        res.status(200).json({
            success: true,
            message: "Experience record deleted successfully"
        });
    } catch (err) {
        console.error("Delete Experience Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    saveExperience,
    deleteExperience
};
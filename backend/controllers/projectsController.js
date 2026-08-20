const pool = require("../config/db");
const { ensureTableColumns } = require("../utils/dynamicSchema");

// =============================
// Save Project
// =============================

const saveProjects = async (req, res) => {
    const client = await pool.connect();
    try {
        await ensureTableColumns(client, "resume_projects", req.body);

        const {
            resume_id,
            project_name,
            technologies_used,
            role,
            start_date,
            end_date,
            currently_working,
            github_url,
            live_project_url,
            project_description
        } = req.body;

        const cleanStartDate = (start_date && start_date !== "" && start_date !== "null") ? start_date : "2024-01-01";
        const cleanEndDate = (end_date && end_date !== "" && end_date !== "null") ? end_date : null;

        const payloadObj = {
            project_id: null,
            resume_id,
            project_name: project_name || "Project",
            technologies_used: technologies_used || "",
            role: role || "Developer",
            start_date: cleanStartDate,
            end_date: cleanEndDate,
            currently_working: currently_working ? true : false,
            github_url: github_url || null,
            live_project_url: live_project_url || null,
            project_description: project_description || "",
            record_status: 1,
            ...req.body
        };

        const jsonData = JSON.stringify([payloadObj]);

        await client.query("BEGIN");

        const cursorResult = await client.query(
            "SELECT * FROM public.upr_insupd_hr_resume_projects_json($1,$2)",
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
        console.error("saveProjects Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    } finally {
        client.release();
    }
};

// =============================
// Get Added Projects
// =============================

const getProjects = async (req, res) => {

    try {

        const { resume_id } = req.params;

        const result = await pool.query(
            "SELECT * FROM public.get_resume_added_projects($1)",
            [resume_id]
        );

        res.json(result.rows);

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// =============================
// Export
// =============================

const deleteProjects = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM resume_projects WHERE project_id = $1", [id]);
        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (err) {
        console.error("Delete Project Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    saveProjects,
    getProjects,
    deleteProjects
};
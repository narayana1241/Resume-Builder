const pool = require("../config/db");
const { ensureTableColumns } = require("../utils/dynamicSchema");

const saveEducation = async (req, res) => {
    const client = await pool.connect();
    try {
        await ensureTableColumns(client, "resume_education", req.body);

        const {
            resume_id,
            degree,
            institution,
            university,
            field_of_study,
            start_year,
            end_year,
            cgpa_percentage,
            currently_studying
        } = req.body;

        const cleanStartYear = start_year ? (parseInt(start_year) || 2020) : 2020;
        const cleanEndYear = end_year ? (parseInt(end_year) || 2024) : 2024;

        const payloadObj = {
            resume_education_id: null,
            resume_id,
            degree: degree || "Degree",
            institution: institution || "",
            university: university || "",
            field_of_study: field_of_study || "",
            start_year: cleanStartYear,
            end_year: cleanEndYear,
            cgpa_percentage: cgpa_percentage ? String(cgpa_percentage) : "",
            currently_studying: currently_studying ? true : false,
            record_status: 1,
            ...req.body
        };

        const jsonData = JSON.stringify([payloadObj]);

        await client.query("BEGIN");

        const cursorResult = await client.query(
            "SELECT * FROM public.upr_insupd_hr_resume_education_json($1,$2)",
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
        console.error("saveEducation Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    } finally {
        client.release();
    }
};

const deleteEducation = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM resume_education WHERE education_id = $1", [id]);
        res.status(200).json({
            success: true,
            message: "Education record deleted successfully"
        });
    } catch (err) {
        console.error("Delete Education Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    saveEducation,
    deleteEducation
};
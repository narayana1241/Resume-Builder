const pool = require("../config/db");
const { ensureTableColumns } = require("../utils/dynamicSchema");

const saveSkills = async (req, res) => {
    const client = await pool.connect();
    try {
        await ensureTableColumns(client, "resume_skills", req.body);

        const {
            resume_id,
            skill_name,
            skill_level,
            experience_years
        } = req.body;

        const payloadObj = {
            resume_skill_id: null,
            resume_id,
            skill_name,
            skill_level,
            experience_years,
            record_status: 1,
            ...req.body
        };

        const jsonData = JSON.stringify([payloadObj]);

        await client.query("BEGIN");

        const cursorResult = await client.query(
            "SELECT * FROM public.upr_insupd_hr_resume_skills_json($1,$2)",
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
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    } finally {
        client.release();
    }
};
const getSkills = async (req, res) => {

    try {

        const { resume_id } = req.params;

        const result = await pool.query(

            "SELECT * FROM public.get_resume_added_skills($1)",

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
const deleteSkills = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM resume_skills WHERE skill_id = $1", [id]);
        res.status(200).json({
            success: true,
            message: "Skill deleted successfully"
        });
    } catch (err) {
        console.error("Delete Skill Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    saveSkills,
    getSkills,
    deleteSkills
};
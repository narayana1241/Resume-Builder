const pool = require("../config/db");

const saveSkills = async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            resume_id,
            skill_name,
            skill_level,
            experience_years
        } = req.body;

        const jsonData = JSON.stringify([
            {
                resume_skill_id: null,
                resume_id,
                skill_name,
                skill_level,
                experience_years,
                record_status: 1
            }
        ]);

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

    }
    catch (err) {

        await client.query("ROLLBACK");

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
    finally {

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
module.exports = {
    saveSkills,
    getSkills
};
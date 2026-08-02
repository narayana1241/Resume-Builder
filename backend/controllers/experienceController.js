const pool = require("../config/db");

const saveExperience = async (req, res) => {

    const client = await pool.connect();

    try {

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

        const jsonData = JSON.stringify([
            {
                experience_id: null,
                resume_id,
                company_name,
                job_title,
                employment_type,
                location,
                start_date,
                end_date,
                currently_working,
                job_description,
                record_status: 1
            }
        ]);

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

module.exports = {
    saveExperience
};
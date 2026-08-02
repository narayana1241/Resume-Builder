const pool = require("../config/db");

const savePersonalDetails = async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            resume_id,
            first_name,
            last_name,
            email,
            mobile,
            date_of_birth,
            address,
            city,
            state,
            country,
            pincode,
            linkedin_url,
            github_url,
            portfolio_url,
            professional_summary,
            profile_photo
        } = req.body;

        const jsonData = JSON.stringify([
            {
                resume_personal_id: null,
                resume_id,
                first_name,
                last_name,
                email,
                mobile,
                date_of_birth,
                address,
                city,
                state,
                country,
                pincode,
                linkedin_url,
                github_url,
                portfolio_url,
                professional_summary,
                profile_photo,
                record_status: 1
            }
        ]);

        await client.query("BEGIN");

        const cursorResult = await client.query(
            "SELECT * FROM public.upr_insupd_hr_resume_personal_json($1,$2)",
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
    savePersonalDetails
};
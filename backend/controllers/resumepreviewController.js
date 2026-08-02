const pool = require("../config/db");

const getResumePreview = async (req, res) => {

    const client = await pool.connect();

    try {

        const { resume_id } = req.params;

         const { user_id } = req.query;

        await client.query("BEGIN");

        const cursorResult = await client.query(

            "SELECT * FROM public.get_all_preview_data($1,$2)",

            [user_id, resume_id]

        );

        const cursorName = cursorResult.rows[0].p_refcur;

        const result = await client.query(

            `FETCH ALL IN "${cursorName}"`

        );

        await client.query("COMMIT");

       res.json(result.rows[0].var_result_json);

    }
    catch (err) {

        await client.query("ROLLBACK");

        console.log(err);

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

    getResumePreview

};
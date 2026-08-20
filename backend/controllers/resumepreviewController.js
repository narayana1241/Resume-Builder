const pool = require("../config/db");

const getResumePreview = async (req, res) => {

    const client = await pool.connect();

    try {

        const { resume_id } = req.params;
        let userId = req.query.user_id;
        if (!userId || userId === "undefined" || userId === "null") {
            userId = 1;
        }

        await client.query("BEGIN");

        const cursorResult = await client.query(
            "SELECT * FROM public.get_all_preview_data($1,$2)",
            [userId, resume_id]
        );

        const cursorName = cursorResult.rows[0].p_refcur;
        const result = await client.query(`FETCH ALL IN "${cursorName}"`);

        await client.query("COMMIT");

        let previewObj = null;
        if (result.rows.length > 0 && result.rows[0].var_result_json) {
            const rawJson = result.rows[0].var_result_json;
            previewObj = Array.isArray(rawJson.data) ? rawJson.data : rawJson;
        }

        res.status(200).json({
            success: true,
            data: previewObj
        });

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
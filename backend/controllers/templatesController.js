const pool = require("../config/db");

const getAllResumeTemplates = async (req, res) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const cursorResult = await client.query(
            "SELECT * FROM public.get_all_resume_templates()"
        );

        const cursorName = cursorResult.rows[0].p_refcur;

        const result = await client.query(
            `FETCH ALL IN "${cursorName}"`
        );

        await client.query("COMMIT");

        return res.status(200).json({
            success: true,
            data: result.rows[0].var_result_json || result.rows[0].json_build_object || result.rows[0]
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error("Get Resume Templates Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {

        client.release();

    }

};

module.exports = {
    getAllResumeTemplates
};
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

        const rowData = result.rows[0] || {};
        let templatesArray = [];
        if (rowData.var_result_json && Array.isArray(rowData.var_result_json.data)) {
            templatesArray = rowData.var_result_json.data;
        } else if (rowData.var_result_json) {
            templatesArray = rowData.var_result_json;
        } else {
            templatesArray = result.rows;
        }

        return res.status(200).json({
            success: true,
            data: templatesArray
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
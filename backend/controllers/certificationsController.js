const pool = require("../config/db");
const { ensureTableColumns } = require("../utils/dynamicSchema");

const saveCertifications = async (req, res) => {
    const client = await pool.connect();
    try {
        await ensureTableColumns(client, "resume_certifications", req.body);

        const {
            resume_id,
            certification_name,
            issuing_organization,
            issue_date,
            expiry_date,
            credential_id,
            credential_url,
            description
        } = req.body;

        const cleanIssueDate = (issue_date && issue_date !== "" && issue_date !== "null") ? issue_date : null;
        const cleanExpiryDate = (expiry_date && expiry_date !== "" && expiry_date !== "null") ? expiry_date : null;

        const payloadObj = {
            resume_certification_id: null,
            resume_id,
            certification_name: certification_name || "Certification",
            issuing_organization: issuing_organization || "",
            issue_date: cleanIssueDate,
            expiry_date: cleanExpiryDate,
            credential_id: credential_id || null,
            credential_url: credential_url || null,
            description: description || "",
            record_status: 1,
            ...req.body
        };

        const jsonData = JSON.stringify([payloadObj]);

        await client.query("BEGIN");

        const cursorResult = await client.query(
            "SELECT * FROM public.upr_insupd_hr_resume_certifications_json($1,$2)",
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
        console.error("saveCertifications Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    } finally {
        client.release();
    }
};

const getCertifications = async (req, res) => {

    try {

        const { resume_id } = req.params;

        const result = await pool.query(
            "SELECT * FROM public.get_resume_added_certifications($1)",
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

const deleteCertifications = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM resume_certifications WHERE certification_id = $1", [id]);
        res.status(200).json({
            success: true,
            message: "Certification deleted successfully"
        });
    } catch (err) {
        console.error("Delete Certification Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    saveCertifications,
    getCertifications,
    deleteCertifications
};
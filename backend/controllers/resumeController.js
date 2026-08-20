const pool = require("../config/db");
const { ensureTableColumns } = require("../utils/dynamicSchema");

const createResume = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            user_id,
            resume_title,
            template_id
        } = req.body;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "user_id is required"
            });
        }

        const jsonData = JSON.stringify([
            {
                resume_id: null,
                user_id: user_id,
                resume_title: resume_title || "Untitled Resume",
                template_id: template_id || 1,
                created_on: null,
                updated_on: null,
                record_status: 1
            }
        ]);

        await client.query("BEGIN");

        const cursorResult = await client.query(
            "SELECT * FROM public.upr_insupd_hr_resume_master_json($1,$2)",
            [jsonData, 1]
        );

        const cursorName = cursorResult.rows[0].p_refcur;
        const result = await client.query(`FETCH ALL IN "${cursorName}"`);

        await client.query("COMMIT");

        const row = result.rows[0] || {};
        const newResumeId = row.ref_id || row.resume_id;

        res.status(200).json({
            success: true,
            resume_id: newResumeId,
            message: row.message || "Resume created successfully",
            data: row
        });
    } catch(err) {
        await client.query("ROLLBACK");
        console.error("Create Resume Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    } finally {
        client.release();
    }
};

const listUserResumes = async (req, res) => {
    try {
        const { user_id } = req.params;
        const result = await pool.query(
            "SELECT * FROM public.get_user_resumes($1)",
            [user_id]
        );
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error("List Resumes Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const deleteResume = async (req, res) => {
    const client = await pool.connect();
    try {
        const { resume_id } = req.params;
        await client.query("BEGIN");
        
        await client.query("DELETE FROM resume_personal WHERE resume_id = $1", [resume_id]);
        await client.query("DELETE FROM resume_education WHERE resume_id = $1", [resume_id]);
        await client.query("DELETE FROM resume_experience WHERE resume_id = $1", [resume_id]);
        await client.query("DELETE FROM resume_skills WHERE resume_id = $1", [resume_id]);
        await client.query("DELETE FROM resume_projects WHERE resume_id = $1", [resume_id]);
        await client.query("DELETE FROM resume_certifications WHERE resume_id = $1", [resume_id]);
        await client.query("DELETE FROM resume_master WHERE resume_id = $1", [resume_id]);
        
        await client.query("COMMIT");
        res.status(200).json({
            success: true,
            message: "Resume deleted successfully"
        });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Delete Resume Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    } finally {
        client.release();
    }
};

const saveResumeJson = async (req, res) => {
    try {
        const {
            user_id,
            resume_id,
            resume_name,
            template_id,
            resume_json
        } = req.body;

        const now = new Date();

        let existing = null;
        if (resume_id) {
            const checkRes = await pool.query(
                "SELECT resume_id FROM resume_master WHERE resume_id = $1",
                [resume_id]
            );
            if (checkRes.rows.length > 0) {
                existing = checkRes.rows[0];
            }
        }

        if (existing) {
            await pool.query(
                `UPDATE resume_master 
                 SET resume_title = $1, template_id = $2, resume_json = $3, updated_on = $4 
                 WHERE resume_id = $5`,
                [resume_name, template_id, JSON.stringify(resume_json), now, resume_id]
            );
            
            res.status(200).json({
                success: true,
                message: "Resume updated successfully",
                resume_id: resume_id
            });
        } else {
            const insertRes = await pool.query(
                `INSERT INTO resume_master (user_id, resume_title, template_id, resume_json, created_on, updated_on, record_status) 
                 VALUES ($1, $2, $3, $4, $5, $6, 1) 
                 RETURNING resume_id`,
                [user_id, resume_name, template_id, JSON.stringify(resume_json), now, now]
            );
            
            res.status(200).json({
                success: true,
                message: "Resume created successfully",
                resume_id: insertRes.rows[0].resume_id
            });
        }
    } catch (err) {
        console.error("Save Resume JSON Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const saveFullUploadResume = async (req, res) => {
    const client = await pool.connect();
    try {
        const uploadJson = req.body;
        const jsonData = JSON.stringify(uploadJson);

        await client.query("BEGIN");

        // 1. Call Master Unified PL/pgSQL Function upr_insupd_hr_resume_full_upload_json
        const cursorResult = await client.query(
            "SELECT * FROM public.upr_insupd_hr_resume_full_upload_json($1,$2)",
            [jsonData, 1]
        );

        const cursorName = cursorResult.rows[0].p_refcur;
        const result = await client.query(`FETCH ALL IN "${cursorName}"`);
        const row = result.rows[0] || {};
        const savedResumeId = row.ref_id || row.resume_id || uploadJson.resume_id;

        // 2. Update upload_confidence and is_draft on resume_master if provided
        if (savedResumeId) {
            const confidence = uploadJson.upload_confidence !== undefined ? uploadJson.upload_confidence : 100;
            const isDraft = uploadJson.is_draft !== undefined ? uploadJson.is_draft : true;
            await client.query(
                `UPDATE public.resume_master 
                 SET upload_confidence = $1, is_draft = $2, updated_on = CURRENT_TIMESTAMP 
                 WHERE resume_id = $3`,
                [confidence, isDraft, savedResumeId]
            );

            // 3. Call PL/pgSQL function save_resume_custom_sections_json if custom_sections exist
            if (uploadJson.custom_sections && Array.isArray(uploadJson.custom_sections)) {
                await client.query(
                    "SELECT public.save_resume_custom_sections_json($1, $2::jsonb)",
                    [savedResumeId, JSON.stringify(uploadJson.custom_sections)]
                );
            }
        }

        await client.query("COMMIT");

        res.status(200).json({
            success: true,
            resume_id: savedResumeId,
            message: row.message || "Resume upload saved successfully",
            data: row
        });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Save Full Upload Resume Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    } finally {
        client.release();
    }
};

const getEditorResume = async (req, res) => {
    try {
        const { resume_id } = req.params;
        let userId = req.query.user_id;
        if (!userId || userId === "undefined" || userId === "null") {
            userId = 1;
        }

        const result = await pool.query(
            "SELECT public.get_resume_for_editor($1, $2) as editor_data",
            [resume_id, userId]
        );

        if (result.rows.length === 0 || !result.rows[0].editor_data) {
            return res.status(404).json({
                success: false,
                message: "Resume details not found"
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0].editor_data
        });
    } catch (err) {
        console.error("Get Editor Resume Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    createResume,
    listUserResumes,
    deleteResume,
    saveResumeJson,
    saveFullUploadResume,
    getEditorResume
};
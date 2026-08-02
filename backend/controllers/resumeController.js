const pool = require("../config/db");

const createResume = async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            user_id,
            resume_title,
            template_id
        } = req.body;

        const jsonData = JSON.stringify([
            {
                resume_id: null,
                user_id: user_id,
                resume_title: resume_title,
                template_id: template_id,
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

        const result = await client.query(

            `FETCH ALL IN "${cursorName}"`

        );

        await client.query("COMMIT");

        res.json(result.rows[0]);

    }
    catch(err){

        await client.query("ROLLBACK");

        console.log(err);

        res.status(500).json({

            success:false,
            message:err.message

        });

    }
    finally{

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
        
        // Delete related child table data first to satisfy foreign key constraints
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

        // Check if resume_id exists
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
            // Update existing record
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
            // Insert new record
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

module.exports = {
    createResume,
    listUserResumes,
    deleteResume,
    saveResumeJson
};
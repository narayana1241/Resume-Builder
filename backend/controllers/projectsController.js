const pool = require("../config/db");

// =============================
// Save Project
// =============================

const saveProjects = async (req, res) => {

    const client = await pool.connect();

    try {

        const {

            resume_id,
            project_name,
            technologies_used,
            role,
            start_date,
            end_date,
            currently_working,
            github_url,
            live_project_url,
            project_description

        } = req.body;

        const jsonData = JSON.stringify([
            {

                project_id: null,
                resume_id,
                project_name,
                technologies_used,
                role,
                start_date,
                end_date,
                currently_working,
                github_url,
                live_project_url,
                project_description,
                record_status: 1

            }
        ]);

        await client.query("BEGIN");

        const cursorResult = await client.query(

            "SELECT * FROM public.upr_insupd_hr_resume_projects_json($1,$2)",

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

// =============================
// Get Added Projects
// =============================

const getProjects = async (req, res) => {

    try {

        const { resume_id } = req.params;

        const result = await pool.query(

            "SELECT * FROM public.get_resume_added_projects($1)",

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

// =============================
// Export
// =============================

module.exports = {

    saveProjects,

    getProjects

};
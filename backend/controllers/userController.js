const pool = require("../config/db");

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM public.get_users_after_login($1, $2)",
            [email, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error_code: "99999",
                message: "Login Failed"
            });
        }

        const user = result.rows[0];

        res.status(200).json({
            success: user.error_code === "00000",
            error_code: user.error_code,
            message: user.error_message,
            data: user
        });

    } catch (err) {

        console.error("Login Error:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
const registerUser = async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            full_name,
            email,
            mobile,
            password
        } = req.body;

        const jsonData = JSON.stringify([
            {
                user_id: null,
                full_name,
                email,
                mobile,
                password_hash: password,
                is_active: true,
                created_on: null
            }
        ]);

        await client.query("BEGIN");

        // Call PostgreSQL function
        const cursorResult = await client.query(
            "SELECT * FROM public.upr_insupd_hr_users_json($1,$2)",
            [jsonData, 1]
        );

        console.log(cursorResult.rows);

        // Get returned cursor name
        const cursorName = cursorResult.rows[0].p_refcur;

        console.log("Cursor Name:", cursorName);

        // Fetch data from cursor
        const result = await client.query(
            `FETCH ALL IN "${cursorName}"`
        );

        await client.query("COMMIT");

        res.json(result.rows[0]);

    } catch (err) {

        await client.query("ROLLBACK");

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    } finally {

        client.release();

    }

};
const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT * FROM public.get_my_profile_details($1)",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User Profile not found"
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error("Get Profile Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    loginUser,
    registerUser,
    getUserProfile
};
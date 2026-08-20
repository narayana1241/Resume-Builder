const pool = require("../config/db");

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const result = await pool.query(
            "SELECT * FROM public.get_users_after_login($1, $2)",
            [email, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error_code: "99999",
                message: "Invalid Email or Password"
            });
        }

        const user = result.rows[0];

        if (user.error_code !== "00000") {
            return res.status(401).json({
                success: false,
                error_code: user.error_code,
                message: user.error_message || "Login Failed"
            });
        }

        res.status(200).json({
            success: true,
            error_code: user.error_code,
            message: user.error_message || "Login Successful",
            data: user
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Server Error"
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

        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Full name, email, and password are required"
            });
        }

        const jsonData = JSON.stringify([
            {
                user_id: null,
                full_name,
                email,
                mobile: mobile || "",
                password_hash: password,
                is_active: true,
                created_on: null
            }
        ]);

        await client.query("BEGIN");

        const cursorResult = await client.query(
            "SELECT * FROM public.upr_insupd_hr_users_json($1,$2)",
            [jsonData, 1]
        );

        const cursorName = cursorResult.rows[0].p_refcur;
        const result = await client.query(`FETCH ALL IN "${cursorName}"`);

        await client.query("COMMIT");

        const row = result.rows[0] || {};
        const isSuccess = row.error_cd === "00000" || row.error_cd === "0";

        res.status(isSuccess ? 200 : 400).json({
            success: isSuccess,
            error_cd: row.error_cd || "00000",
            message: row.message || row.error_msg || "User registered successfully",
            user_id: row.ref_id || null,
            data: row
        });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Register Error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Server Error"
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
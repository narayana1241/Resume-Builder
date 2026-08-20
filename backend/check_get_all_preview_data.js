const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const res = await pool.query(`
      SELECT pg_get_functiondef(oid)
      FROM pg_proc
      WHERE proname = 'get_all_preview_data';
    `);
    console.log("Function Definition for get_all_preview_data:");
    console.log(res.rows[0].pg_get_functiondef);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

main();

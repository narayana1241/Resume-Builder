const pool = require("../config/db");

/**
 * Maps JS value types to appropriate PostgreSQL data types
 */
function inferPgType(val) {
    if (val === null || val === undefined) return "TEXT";
    if (typeof val === "boolean") return "BOOLEAN";
    if (typeof val === "number") {
        return Number.isInteger(val) ? "BIGINT" : "NUMERIC";
    }
    if (typeof val === "object") {
        return "JSONB";
    }
    if (typeof val === "string") {
        // Simple date string test (YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return "DATE";
        // ISO Timestamp test
        if (/^\d{4}-\d{2}-\d{2}T/.test(val)) return "TIMESTAMP WITHOUT TIME ZONE";
        if (val.length > 500) return "TEXT";
        return "VARCHAR(500)";
    }
    return "TEXT";
}

/**
 * Sanitizes a JS property key into a safe PostgreSQL column identifier
 */
function sanitizeColumnName(key) {
    return key
        .replace(/([a-z])([A-Z])/g, "$1_$2") // camelCase to snake_case
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");
}

/**
 * Checks information_schema.columns for tableName and adds missing columns dynamically.
 * @param {Object} dbClient - pg client or pool
 * @param {string} tableName - e.g. "resume_personal", "resume_education"
 * @param {Object|Array} sampleData - Single object or array of objects representing rows to be saved
 */
async function ensureTableColumns(dbClient, tableName, sampleData) {
    if (!sampleData || (typeof sampleData !== "object")) return [];

    const client = dbClient || pool;
    const cleanTableName = tableName.toLowerCase();

    // 1. Fetch existing columns for this table
    const colRes = await client.query(
        `SELECT column_name 
         FROM information_schema.columns 
         WHERE table_schema = 'public' AND LOWER(table_name) = $1`,
        [cleanTableName]
    );

    const existingCols = new Set(colRes.rows.map(r => r.column_name.toLowerCase()));

    // 2. Aggregate all keys from sampleData
    const items = Array.isArray(sampleData) ? sampleData : [sampleData];
    const keyTypesMap = {};

    for (const item of items) {
        if (!item || typeof item !== "object") continue;
        for (const [key, val] of Object.entries(item)) {
            const colName = sanitizeColumnName(key);
            if (!colName || colName === "null" || colName === "undefined") continue;

            if (!keyTypesMap[colName]) {
                keyTypesMap[colName] = inferPgType(val);
            }
        }
    }

    const addedColumns = [];

    // 3. For any column not existing in DB, execute ALTER TABLE ... ADD COLUMN IF NOT EXISTS
    for (const [colName, pgType] of Object.entries(keyTypesMap)) {
        if (!existingCols.has(colName)) {
            try {
                const alterSql = `ALTER TABLE public.${cleanTableName} ADD COLUMN IF NOT EXISTS ${colName} ${pgType};`;
                console.log(`[DynamicSchema] Executing: ${alterSql}`);
                await client.query(alterSql);
                existingCols.add(colName);
                addedColumns.push({ column: colName, type: pgType });
            } catch (err) {
                console.error(`[DynamicSchema] Error adding column ${colName} to ${cleanTableName}:`, err.message);
            }
        }
    }

    return addedColumns;
}

module.exports = {
    ensureTableColumns,
    inferPgType,
    sanitizeColumnName
};

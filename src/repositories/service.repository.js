import { pool } from "../config/db.js"

export async function getAllServices() {
    const [rows] = await pool.execute('SELECT * FROM service WHERE is_active = true')

    return rows
}
import { pool } from "../config/db.js"

export async function getAllServices() {
    const [rows] = await pool.execute('SELECT * FROM service WHERE is_active = true')
    return rows
}

export async function getServiceById(id) {
    const [rows] = await pool.execute('SELECT * FROM service WHERE is_active = true AND id = ?', [id])
    return rows[0]
}
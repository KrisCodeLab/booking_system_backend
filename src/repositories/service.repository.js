import { pool } from "../config/db.js"

export async function getAllServices() {
    const [rows] = await pool.execute('SELECT * FROM service WHERE is_active = true')
    return rows
}

export async function getServiceById(id) {
    const [rows] = await pool.execute('SELECT * FROM service WHERE is_active = true AND id = ?', [id])
    return rows[0]
}

export async function createNewService(data) {
    const[result] = await pool.execute(
        `INSERT INTO service (service_name, price, duration)
            VALUES (:service_name, :price, :duration)`,
        data)
    return result
}

export async function updateServicePrice(data) {
    const [result] = await pool.execute(
        `UPDATE service SET price = :price WHERE id = :service_id`,
        data
    )
    return result
}
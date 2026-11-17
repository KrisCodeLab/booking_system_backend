import { pool } from "../config/db.js"

export async function getAllAppointments() {
    const [rows] = await pool.execute('SELECT * FROM appointment')
    return rows
}

export async function getAppointmentByToken(token) {
    const [rows] = await pool.execute('SELECT * FROM appointment WHERE token = ?', [token])
    return rows
}

export async function cancelAppointment(token) {
    const [rows] = await pool.execute('UPDATE appointment SET appointment_status_id = 4 WHERE token = ?', [token])
    return rows
}
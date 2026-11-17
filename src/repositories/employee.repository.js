import { pool } from "../config/db.js"

export async function getEmployeesByServiceID(id) {
    
    const sql = `SELECT e.id, e.employee_name
            FROM employee AS e
            JOIN employee_service AS es
                ON e.id = es.employee_id
            JOIN service AS s
                ON es.service_id = s.id
            WHERE s.id = ?
                AND e.is_active = TRUE
                AND s.is_active = TRUE`
    const [row] = await pool.execute(sql, [id])
    return row
}
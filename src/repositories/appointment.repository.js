import { pool } from "../config/db.js"

export async function getAllAppointments() {
    const [rows] = await pool.execute('SELECT * FROM appointment')
    return rows
}

export async function getAppointmentByToken(token) {
    const [rows] = await pool.execute(`SELECT a.id, a.service_id, a.employee_id, a.customer_id,
            DATE_FORMAT(a.start_date, '%Y-%m-%dT%H:%i:%s') AS start_date,
            DATE_FORMAT(a.end_date, '%Y-%m-%dT%H:%i:%s') AS end_date,
            a.appointment_status_id, a.token,
            s.service_name, s.duration, s.price,
            e.employee_name, c.customer_name
        FROM appointment AS a
        JOIN service AS s ON s.id = a.service_id
        JOIN employee AS e ON e.id = a.employee_id
        JOIN customer AS c ON c.id = a.customer_id
        WHERE a.token = ?`, [token])
    return rows
}

export async function openingTimes(day) {
    const [rows] = await pool.execute('SELECT start_time, end_time FROM opening_time WHERE weekday = ?', [day])
    return rows[0]
}

export async function getAllAppointmentsByDayAndService(data) {
    if (data.employee_id === undefined) {
        const [rows] = await pool.execute(`
            SELECT e.id AS employee_id, a.start_date, a.end_date
            FROM employee AS e
            JOIN employee_service AS es ON es.employee_id = e.id
            LEFT JOIN appointment AS a
                ON a.employee_id = e.id
                AND DATE(a.start_date) = ?
                AND a.appointment_status_id <> 4
            WHERE es.service_id = ?
                AND e.is_active = TRUE
            ORDER BY e.id, a.start_date`, 
            [data.date, data.service_id])
        return rows
    } else {
        const [rows] = await pool.execute(`
            SELECT employee_id, start_date, end_date
            FROM appointment
            WHERE employee_id = ?
                AND DATE(start_date) = ?
                AND appointment_status_id <> 4
            ORDER BY start_date;
            `, 
            [data.employee_id, data.date])
        return rows
    }
}

export async function updateAppointmentStatus(token, id, status) {
    if(token) {
        const [rows] = await pool.execute('UPDATE appointment SET appointment_status_id = 4 WHERE token = ?', [token])
        return rows
    } else {
        const [rows] = await pool.execute('UPDATE appointment SET appointment_status_id = ? WHERE id = ?', [status, id])
        return rows
    }
}

export async function createNewAppointment(appointmentData) {
    const [result] = await pool.execute(
        `INSERT INTO appointment (service_id, customer_id, employee_id, start_date, end_date, token)
        VALUES(:service_id, :customer_id, :employee_id, :start_date, :end_date, :token)`,
        appointmentData
    )

    return result
}

export async function createNewAppointmentAndCustomer(appointmentData, customerData) {
    const conn = await pool.getConnection()
    
    try {
        await conn.beginTransaction()

        const [customerRes] = await conn.execute(
            `INSERT INTO customer (customer_name, phone, mail)
            VALUES (:customer_name, :phone, :mail)`,
            customerData
        )

        appointmentData.customer_id = customerRes.insertId
    
        const [appointmentRes] = await conn.execute(
            `INSERT INTO appointment (service_id, customer_id, employee_id, start_date, end_date, token)
            VALUES(:service_id, :customer_id, :employee_id, :start_date, :end_date, :token)`,
            appointmentData
        )

        await conn.commit()

        return {appointmentRes, customerRes}

    } catch (error) {

        await conn.rollback()
        throw error

    } finally {
        conn.release()
    }
}
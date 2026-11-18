import { pool } from "../config/db.js"

export async function getCustomerByMail(mail) {
    const [row] = await pool.execute(`SELECT * FROM customer WHERE mail = ?`, [mail])
    return row[0]
}
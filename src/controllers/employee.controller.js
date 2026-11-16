import { employeesByServiceID } from "../services/employee.service.js"


export async function getEmployeesByService(req, res) {
    try {
        const serviceID = req.params.id
        const employees = await employeesByServiceID(serviceID)
        res.status(200).json(employees)
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message })
    }
}
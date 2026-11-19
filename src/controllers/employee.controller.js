import { employeesByServiceId } from "../services/employee.service.js"


export async function getEmployeesByService(req, res) {
    try {
        const serviceId = req.params.service_id
        const employees = await employeesByServiceId(serviceId)
        res.status(200).json(employees)
    } catch (error) {
        console.error("Fehler beim Laden der Mitarbeiter:", error)

        res.status(500).json({
            message: "Die Mitarbeiter konnten nicht geladen werden."
        })
    }
}


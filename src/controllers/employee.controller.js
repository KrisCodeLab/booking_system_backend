import { employeesByServiceID } from "../services/employee.service.js"


export async function getEmployeesByService(req, res) {
    try {
        const serviceID = req.params.serviceId
        const employees = await employeesByServiceID(serviceID)
        res.status(200).json(employees)
    } catch (error) {
        console.error("Fehler beim Laden der Mitarbeiter:", error)

        res.status(500).json({
            message: "Die Mitarbeiter konnten nicht geladen werden."
        })
}
}
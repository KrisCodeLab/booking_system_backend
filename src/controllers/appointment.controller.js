import { allAppointments, cancelAppointmentWithToken, getAppointment  } from "../services/appointment.service.js"

export async function getAppointments(req, res) {
    try {
        const appointments = await allAppointments()
        res.status(200).json(appointments)
    } catch (error) {
        console.error("Fehler beim Laden der Termine:", error)

        res.status(500).json({
            message: "Die Termine konnten nicht geladen werden."
        })
    }
}

export async function getAppointmentByToken(req, res) {
    try {
        const token = req.params.token
        const appointment = await getAppointment(token)
        res.status(200).json(appointment)
    } catch (error) {
    const statusCode = error.statusCode ?? 500

        if (statusCode === 500) {
            console.error("Fehler beim Laden des Termins:", error)
        }

        res.status(statusCode).json({
            message: statusCode === 500
                ? "Der Termin konnte nicht geladen werden."
                : error.message
        })
    }
}

export async function cancelAppointment(req, res) {
    try {
        const token = req.params.token
        const result = await cancelAppointmentWithToken(token)
        res.json(result)
    } catch (error) {
        const statusCode = error.statusCode ?? 500

        if (statusCode === 500) {
            console.error("Fehler beim Stornieren des Termins:", error)
        }

        res.status(statusCode).json({
            message: statusCode === 500
                ? "Der Termin konnte nicht storniert werden."
                : error.message
        })
    }
}
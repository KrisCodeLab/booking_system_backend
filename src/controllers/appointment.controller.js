import { allAppointments, cancelAppointmentWithToken, getAppointment, getTimeslotsForDay, bookAppointment  } from "../services/appointment.service.js"

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

export async function getFreeTimeslots(req, res) {
    try {
        const data = {
            serviceId: req.query.serviceId,
            employeeId: req.query.employeeId,
            date: req.query.date
        }
        const timeslots = await getTimeslotsForDay(data)
        res.status(200).json(timeslots)
    } catch (error) {
    const statusCode = error.statusCode ?? 500

        if (statusCode === 500) {
            console.error("Fehler beim Laden der verfügbaren Zeiten:", error)
        }

        res.status(statusCode).json({
            message: statusCode === 500
                ? "Die verfügbaren Termine konnten nicht geladen werden."
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

export async function newAppointment(req, res) {
    try {
        const result = await bookAppointment(req.body)
        res.status(201).json(result)
    } catch (error) {
        const statusCode = error.statusCode ?? 500

        if (statusCode === 500) {
            console.error("Fehler beim Buchen des Termins:", error)
        }

        res.status(statusCode).json({
            message: statusCode === 500
                ? "Der Termin konnte nicht gebucht werden."
                : error.message
        })
    }
}
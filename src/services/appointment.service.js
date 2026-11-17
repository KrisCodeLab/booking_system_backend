import { getAllAppointments, cancelAppointment, getAppointmentByToken } from "../repositories/appointment.repository.js"


export async function allAppointments() {
    const appointments = await getAllAppointments()
    return appointments
}

export async function getAppointment(token) {
    const appointment = await getAppointmentByToken(token)
    if (appointment.length === 0) {
        const error = new Error("Ihr Termin existiert nicht.")
        error.statusCode = 404
        throw error
    }
    return appointment[0]
}

export async function cancelAppointmentWithToken(token) {
    const appointment = await getAppointment(token)
    const appointmentStart = new Date(appointment.start_date)
    const cancellationDeadline = appointmentStart.getTime() - 24 * 60 * 60 * 1000

    if (appointment.appointment_status_id === 4) 
        return { message: "Ihr Termin wurde bereits storniert." }

    if (Date.now() > cancellationDeadline) {
    const error = new Error(
        "Eine Online-Stornierung ist nur bis 24 Stunden vor dem Termin möglich. Bitte wenden Sie sich telefonisch an uns."
        )
        error.statusCode = 409
        throw error
    }
   
    await cancelAppointment(token)
    return { message: "Ihr Termin wurde storniert." }
}
import { getAllAppointments, cancelAppointment, getAppointmentByToken, openingTimes, getAllAppointmentsByDayAndService } from "../repositories/appointment.repository.js"
import { getServiceById } from "../repositories/service.repository.js"


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

async function getOpeningTimes(date) {
    const weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]
    const weekday = weekdays[new Date(date).getDay()]
    const times = await openingTimes(weekday)
    return times
}

export async function getTimeslotsForDay(data) {
    const timeslots = []
    const openingTimes = await getOpeningTimes(data.date)
    if (!openingTimes) return { message: "Salon geschlossen, keine verfügbaren Termine." }

    const service = await getServiceById(data.serviceId)
    const appointments = await getAllAppointmentsByDayAndService(data)

    const opening = new Date(`${data.date}T${openingTimes.start_time}`)
    const closing = new Date(`${data.date}T${openingTimes.end_time}`)
    const now = new Date()
    now.setSeconds(0, 0)

    const nowMinutesRemainder = now.getMinutes() % 15

    const duration = service.duration * 60 * 1000
    const leadTime = 120 * 60 * 1000
    const interval = 15 * 60 * 1000

    let earliestStart

    if (opening.getTime() < now.getTime() + leadTime) {
        if (nowMinutesRemainder === 0) {
            earliestStart = now.getTime() + leadTime
        } else {
            now.setMinutes(now.getMinutes() + 15 - nowMinutesRemainder)
            earliestStart = now.getTime() + leadTime
        } 
    } else {
        earliestStart = opening.getTime()
    }

    const latestStart = closing.getTime() - duration

    
    for (let slot = earliestStart; slot <= latestStart; slot += interval) {
        let slotAvailable = true

        if (data.employeeId) {
            slotAvailable = checkEmployeesAvailability(appointments, slot, duration)
        } else {
            slotAvailable = checkSlotAvailability(appointments, slot, duration)
        }


        if (slotAvailable) {
            const time = new Date(slot).toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit"
            })
            timeslots.push(time)
        }
    }

    if (timeslots.length < 1)
        return { message: "Leider existieren keine verfügbaren Termine an diesen Tag." }
    else
        return timeslots
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

function checkEmployeesAvailability (appointments, slot, duration){
    let slotAvailable = true
    for (const appointment of appointments) {
        if (
            slot < appointment.end_date.getTime() &&
            slot + duration > appointment.start_date.getTime()
        ){
            slotAvailable = false
            break
        }
    }
    return slotAvailable
}

function checkSlotAvailability (appointments, slot, duration) {
    let slotAvailable = false
    const employeeIds = []

    for (const appointment of appointments) {
        if (!employeeIds.includes(appointment.employee_id)) {
            employeeIds.push(appointment.employee_id)
        }
    }

    for (const employeeId of employeeIds) {
        let employeeAvailable = true

        for (const appointment of appointments) {
            if (appointment.employee_id !== employeeId) {
                continue
            }

            if (appointment.start_date === null) {
                continue
            }

            if (
                slot < appointment.end_date.getTime() &&
                slot + duration > appointment.start_date.getTime()
            ) {
                employeeAvailable = false
                break
            }
        }

        if (employeeAvailable) {
            slotAvailable = true
            break
        }
    }
    return slotAvailable
}

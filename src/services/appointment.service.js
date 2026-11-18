import { 
    getAllAppointments, 
    cancelAppointment, 
    getAppointmentByToken, 
    openingTimes, 
    getAllAppointmentsByDayAndService, 
    createNewAppointment, 
    createNewAppointmentAndCustomer 
} from "../repositories/appointment.repository.js"
import { getCustomerByMail } from "../repositories/customer.repository.js"
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

    const requestedDate = new Date(`${data.date}T00:00:00`)
    const currentDate = new Date()
    currentDate.setSeconds(0, 0)

    const limit = new Date(currentDate)
    limit.setMonth(limit.getMonth() + 3)
    if (limit.getDate() !== currentDate.getDate()) limit.setDate(0)
    limit.setHours(0, 0, 0, 0)

    if (requestedDate > limit) {
        return { message: "Termine sind höchstens drei Monate im Voraus buchbar." }
}
    const openingTimes = await getOpeningTimes(data.date)
    if (!openingTimes) return { message: "Salon geschlossen, keine verfügbaren Termine." }

    const service = await getServiceById(data.serviceId)
    const appointments = await getAllAppointmentsByDayAndService(data)

    const opening = new Date(`${data.date}T${openingTimes.start_time}`)
    const closing = new Date(`${data.date}T${openingTimes.end_time}`)
    
    const nowMinutesRemainder = currentDate.getMinutes() % 15

    const duration = service.duration * 60 * 1000
    const leadTime = 120 * 60 * 1000
    const interval = 15 * 60 * 1000

    let earliestStart

    if (opening.getTime() < currentDate.getTime() + leadTime) {
        if (nowMinutesRemainder === 0) {
            earliestStart = currentDate.getTime() + leadTime
        } else {
            currentDate.setMinutes(currentDate.getMinutes() + 15 - nowMinutesRemainder)
            earliestStart = currentDate.getTime() + leadTime
        } 
    } else {
        earliestStart = opening.getTime()
    }

    const latestStart = closing.getTime() - duration

    
    for (let slot = earliestStart; slot <= latestStart; slot += interval) {
        let slotAvailable = true

        if (data.employeeId) {
            slotAvailable = await checkEmployeesAvailability(appointments, slot, duration)
        } else {
            slotAvailable = Boolean(await checkFreeEmployeeForSlot(appointments, slot, duration))
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

async function checkEmployeesAvailability (appointments, slot, duration){
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

async function checkFreeEmployeeForSlot (appointments, slot, duration) {
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
            return employeeId
        }
    }
}

export async function bookAppointment(data) {
    const [appointmentData, customerData] = data
    const service = await getServiceById(appointmentData.service_id)
    const appointments = await getAllAppointmentsByDayAndService({
        employeeId: appointmentData.employee_id,
        date: appointmentData.start_date.split("T")[0]
    })

    const duration = service.duration * 60 * 1000

    const slotAvailable = await checkEmployeesAvailability(appointments, new Date(appointmentData.start_date).getTime(), duration)
    const customer = await getCustomerByMail(customerData.mail)
    const endDateinMs = new Date(appointmentData.start_date).getTime() + duration
    appointmentData.end_date = new Date(endDateinMs)
    appointmentData.token = crypto.randomUUID()

    if (slotAvailable) {
        if (!customer) {
            await createNewAppointmentAndCustomer(appointmentData, customerData)
            return { message: "Ihr Termin wurde gebucht." }
        } else {
            appointmentData.customer_id = customer.id
            await createNewAppointment(appointmentData)
            return { message: "Ihr Termin wurde gebucht." }
        }
    } else {
        const error = new Error("Da war jemand anderes schneller, bitte wählen Sie einen neuen Termin.")
        error.statusCode = 409
        throw error
    }
}

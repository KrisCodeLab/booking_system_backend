import express from 'express'
import { getAppointments, cancelAppointmentByToken, updateAppointmentStatus, getAppointmentByToken, getFreeTimeslots, newAppointment } from '../controllers/appointment.controller.js'

export const router = new express.Router()

router.get('/appointments', getAppointments) // TODO: Route anpassen -> gibt aktuell auch Tokens und andere Daten aus! 
router.get('/appointment/:token', getAppointmentByToken)
router.get('/availability', getFreeTimeslots)

router.post('/appointment/new', newAppointment)

router.patch('/appointment/cancel/:token', cancelAppointmentByToken)
router.patch('/appointment/status/:id/:status', updateAppointmentStatus)

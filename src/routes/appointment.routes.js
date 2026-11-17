import express from 'express'
import { getAppointments, cancelAppointment, getAppointmentByToken } from '../controllers/appointment.controller.js'

export const router = new express.Router()

router.get('/appointments', getAppointments) // TODO: Route anpassen -> gibt aktuell auch Tokens und andere Daten aus! 
router.get('/appointment/:token', getAppointmentByToken)

router.patch('/appointment/:token', cancelAppointment)
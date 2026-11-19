import express from 'express'
import { getEmployeesByService, getEmployeeById } from '../controllers/employee.controller.js'

export const router = new express.Router()

router.get('/employee/:service_id', getEmployeesByService)
router.get('/employees/:id', getEmployeeById)

// TODO: Route für employee - service zuordnung anlegen

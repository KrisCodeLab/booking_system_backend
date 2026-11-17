import express from 'express'
import { getEmployeesByService } from '../controllers/employee.controller.js'

export const router = new express.Router()

router.get('/employee/:serviceId', getEmployeesByService)
import express from 'express'
import { getServices } from '../controllers/service.controller.js'

export const router = new express.Router()

router.get('/services', getServices) 
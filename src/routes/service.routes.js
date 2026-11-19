import express from 'express'
import { getServices, createNewService, changePrice } from '../controllers/service.controller.js'

export const router = new express.Router()

router.get('/services', getServices) 

router.post('/services/new', createNewService)

router.patch('/services/price', changePrice)
import { allServices, createService, changeServicePrice } from "../services/service.service.js"


export async function getServices(req, res) {
    try {
        const services = await allServices()
        res.status(200).json(services)
    } catch (error) {
        console.error("Fehler beim Laden der Leistungen:", error)
        res.status(500).json({
            message: "Die Leistungen konnten nicht geladen werden."
        })
    }
}

export async function createNewService(req, res) {
    //TODO: Zugriffsbeschränkung einbauen
    try {
        const result = await createService(req.body)
        res.status(201).json(result)
    } catch (error) {
        const statusCode = error.statusCode ?? 500

        if (statusCode === 500) {
            console.error("Fehler beim erstellen des Service:", error)
        }

        res.status(statusCode).json({
            message: statusCode === 500
                ? "Der Service konnte nicht erstellt werden."
                : error.message
        })
    }
}

export async function changePrice(req, res) {
    //TODO: Zugriffsbeschränkung einbauen
    try {
        const data = {
            service_id: req.query.service_id,
            price: req.query.price
        }
        const result = await changeServicePrice(data)
        res.status(201).json(result)
    } catch (error) {
        const statusCode = error.statusCode ?? 500

        if (statusCode === 500) {
            console.error("Fehler beim anpassen des Preises:", error)
        }

        res.status(statusCode).json({
            message: statusCode === 500
                ? "Der Preis konnte nicht angepasst werden."
                : error.message
        })
    }  
}
import { allServices } from "../services/service.service.js"


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
import { getAllServices, createNewService, updateServicePrice } from "../repositories/service.repository.js"


export async function allServices() {
    const services = await getAllServices()
    return services
}

export async function createService(data) {
    await createNewService(data)
    return { message: "Der Service wurde erfolgreich angelegt. Bitte weisen Sie die entsprechenden Mitarbeiter zu." }
}

export async function changeServicePrice(data) {
    //TODO: Zugriffsbeschränkung einbauen
    const result = await updateServicePrice(data)

    if (result.affectedRows === 0) {
        const error = new Error("Der Service existiert nicht.")
        error.statusCode = 404
        throw error
    }

    return { message: "Der Service Preis wurde geändert." }
}

import { getAllServices } from "../repositories/service.repository.js"


export async function allServices() {
    const services = await getAllServices()
    return services
}
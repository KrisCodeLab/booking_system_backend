import { getEmployeesByServiceId, getEmployeeById } from "../repositories/employee.repository.js"

export async function employeesByServiceId(id){
    const employee = await getEmployeesByServiceId(id)
    return employee
}

export async function employeeById(id){
    const employee = await getEmployeeById(id)
    return employee
}

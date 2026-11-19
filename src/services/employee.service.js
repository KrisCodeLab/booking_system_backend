import { getEmployeesByServiceId } from "../repositories/employee.repository.js"

export async function employeesByServiceId(id){
    const employee = await getEmployeesByServiceId(id)
    return employee
}
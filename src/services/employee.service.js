import { getEmployeesByServiceID } from "../repositories/employee.repository.js"

export async function employeesByServiceID(id){
    const employee = await getEmployeesByServiceID(id)
    return employee
}
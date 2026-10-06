import { http, unwrapList } from './http'
import type { Employee, EmployeePayload } from '../types'

export const employeeApi = {
  getAll: async (): Promise<Employee[]> => {
    const response = await http.get('/employees')
    return unwrapList<Employee>(response.data, 'employees')
  },
  create: async (p: EmployeePayload): Promise<Employee> => (await http.post('/employees', p)).data,
  update: async (id: number, p: EmployeePayload): Promise<Employee> =>
    (await http.put(`/employees/${id}`, p)).data,
  remove: async (id: number): Promise<void> => {
    await http.delete(`/employees/${id}`)
  },
}
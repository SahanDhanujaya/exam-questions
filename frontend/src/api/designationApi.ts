import { http, unwrapList } from './http'
import type { Designation, DesignationPayload } from '../types'

export const designationApi = {
  getAll: async (): Promise<Designation[]> => {
    const response = await http.get('/designations')
    return unwrapList<Designation>(response.data, 'designations')
  },
  create: async (payload: DesignationPayload): Promise<Designation> => {
    const response = await http.post('/designations', payload)
    return response.data
  },
}

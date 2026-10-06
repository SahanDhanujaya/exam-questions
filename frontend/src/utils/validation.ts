import type { DesignationPayload, EmployeeFormValues } from '../types'

export type Errors<T> = Partial<Record<keyof T, string | undefined>>

export const todayISO = (): string => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

export function validateDesignation(v: DesignationPayload): Errors<DesignationPayload> {
  const e: Errors<DesignationPayload> = {}
  const name = v.name.trim()
  if (!name) e.name = 'Designation name is required'
  else if (name.length < 2) e.name = 'Name must be at least 2 characters'
  else if (name.length > 100) e.name = 'Name must be 100 characters or less'
  if (v.remark.length > 255) e.remark = 'Remark must be 255 characters or less'
  return e
}

export function validateEmployee(v: EmployeeFormValues): Errors<EmployeeFormValues> {
  const e: Errors<EmployeeFormValues> = {}
  const name = v.fullName.trim()
  if (!name) e.fullName = 'Full name is required'
  else if (name.length < 2) e.fullName = 'Full name must be at least 2 characters'
  else if (name.length > 100) e.fullName = 'Full name must be 100 characters or less'
  else if (!/^\p{L}[\p{L}\s.'-]*$/u.test(name)) e.fullName = "Use letters, spaces and . ' - only"

  if (!v.designationId) e.designationId = 'Please select a designation'

  if (!v.dateOfJoin) e.dateOfJoin = 'Date of join is required'
  else if (v.dateOfJoin > todayISO()) e.dateOfJoin = 'Date of join cannot be in the future'

  return e
}
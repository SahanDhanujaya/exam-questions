export interface Designation {
  id: number
  name: string
  remark?: string | null
  designationName?: string
  designation?: string
}

export interface DesignationPayload {
  name: string
  remark: string
}

export interface Employee {
  id: number
  designationId?: number
  designation_id?: number
  designationName?: string
  designation_name?: string
  firstName?: string
  lastName?: string
  fullName?: string
  dateOfJoin: string // yyyy-MM-dd
  manager: boolean
}

export interface EmployeeFormValues {
  fullName: string
  designationId: string // select එකේ value string
  dateOfJoin: string
  manager: boolean
}

export interface EmployeePayload {
  fullName: string
  designationId: number
  dateOfJoin: string
  manager: boolean
}

export interface ApiError {
  message: string
  fieldErrors?: Record<string, string>
}
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { employeeApi } from '../api/employeeApi'
import { extractError } from '../api/http'
import { useToast } from './Toast'
import ConfirmDialog from './ConfirmDialog'
import { todayISO, validateEmployee } from '../utils/validation'
import type { Errors } from '../utils/validation'
import type { Designation, Employee, EmployeeFormValues } from '../types'

interface Props {
  employee: Employee | null // null = අලුත් employee කෙනෙක්
  designations: Designation[]
  onSaved: () => void
  onDeleted: () => void
  onNew: () => void
}

const emptyValues: EmployeeFormValues = { fullName: '', designationId: '', dateOfJoin: '', manager: false }

const toValues = (e: Employee | null): EmployeeFormValues => {
  if (!e) return emptyValues

  const designationId = e.designationId ?? e.designation_id ?? ''
  const fullName = e.fullName ?? `${e.firstName ?? ''} ${e.lastName ?? ''}`.trim()

  return {
    fullName,
    designationId: String(designationId),
    dateOfJoin: e.dateOfJoin,
    manager: Boolean(e.manager),
  }
}

export default function EmployeeForm({ employee, designations, onSaved, onDeleted, onNew }: Props) {
  const toast = useToast()
  const isEdit = employee !== null

  const [values, setValues] = useState<EmployeeFormValues>(toValues(employee))
  const [errors, setErrors] = useState<Errors<EmployeeFormValues>>({})
  const [busy, setBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    setValues(toValues(employee))
    setErrors({})
  }, [employee])

  const set = <K extends keyof EmployeeFormValues>(key: K, value: EmployeeFormValues[K]) => {
    setValues((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const handleReset = () => {
    setValues(toValues(employee))
    setErrors({})
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    const found = validateEmployee(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const payload = {
      fullName: values.fullName.trim(),
      designationId: Number(values.designationId),
      dateOfJoin: values.dateOfJoin,
      manager: values.manager,
    }

    setBusy(true)
    try {
      if (isEdit) await employeeApi.update(employee.id, payload)
      else await employeeApi.create(payload)
      toast('success', isEdit ? 'Employee updated' : 'Employee saved')
      onSaved()
    } catch (err) {
      const apiErr = extractError(err)
      if (apiErr.fieldErrors) setErrors(apiErr.fieldErrors as Errors<EmployeeFormValues>)
      toast('error', apiErr.message)
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!employee) return
    setBusy(true)
    try {
      await employeeApi.remove(employee.id)
      toast('success', 'Employee deleted')
      setConfirmOpen(false)
      onDeleted()
    } catch (err) {
      toast('error', extractError(err).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSave} noValidate className="space-y-4">
        <div>
          <label className="field-label" htmlFor="empId">Employee ID</label>
          <input id="empId" className="field-input" value={employee ? employee.id : 'Auto generated'} disabled readOnly />
        </div>

        <div>
          <label className="field-label" htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            className="field-input"
            placeholder="e.g. Kasun Perera Silva"
            value={values.fullName}
            aria-invalid={!!errors.fullName}
            onChange={(e) => set('fullName', e.target.value)}
          />
          {errors.fullName && <p className="field-error">{errors.fullName}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="designation">Designation</label>
          <select
            id="designation"
            className="field-input"
            value={values.designationId}
            aria-invalid={!!errors.designationId}
            onChange={(e) => set('designationId', e.target.value)}
          >
            <option value="">-- Select designation --</option>
            {designations.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          {errors.designationId && <p className="field-error">{errors.designationId}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="dateOfJoin">Date of Join</label>
          <input
            id="dateOfJoin"
            type="date"
            max={todayISO()}
            className="field-input"
            value={values.dateOfJoin}
            aria-invalid={!!errors.dateOfJoin}
            onChange={(e) => set('dateOfJoin', e.target.value)}
          />
          {errors.dateOfJoin && <p className="field-error">{errors.dateOfJoin}</p>}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
            checked={values.manager}
            onChange={(e) => set('manager', e.target.checked)}
          />
          Is Manager
        </label>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4">
          <div>
            {isEdit && (
              <button type="button" className="btn btn-danger" disabled={busy} onClick={() => setConfirmOpen(true)}>
                Delete
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" disabled={busy} onClick={onNew}>New</button>
            <button type="button" className="btn btn-secondary" disabled={busy} onClick={handleReset}>Reset</button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete employee"
        message={`Are you sure you want to delete "${employee?.fullName ?? ''}"? This action cannot be undone.`}
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}
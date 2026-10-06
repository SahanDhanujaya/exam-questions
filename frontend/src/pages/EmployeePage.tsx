import { useCallback, useEffect, useMemo, useState } from 'react'
import { employeeApi } from '../api/employeeApi'
import { designationApi } from '../api/designationApi'
import { extractError } from '../api/http'
import { useToast } from '../components/Toast'
import Modal from '../components/Modal'
import EmployeeForm from '../components/EmployeeForm'
import type { Designation, Employee } from '../types'

export default function EmployeePage() {
  const toast = useToast()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [designations, setDesignations] = useState<Designation[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<Employee | null>(null)
  const [formKey, setFormKey] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [employeesResult, designationsResult] = await Promise.allSettled([
        employeeApi.getAll(),
        designationApi.getAll(),
      ])

      if (employeesResult.status === 'fulfilled') {
        setEmployees(employeesResult.value)
      } else {
        setEmployees([])
        toast('error', extractError(employeesResult.reason).message)
      }

      if (designationsResult.status === 'fulfilled') {
        setDesignations(designationsResult.value)
      } else {
        setDesignations([])
        toast('error', extractError(designationsResult.reason).message)
      }
    } catch (err) {
      toast('error', extractError(err).message)
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return employees
    return employees.filter((e) =>
      `${e.id} ${e.designationName} ${e.fullName}`.toLowerCase().includes(q),
    )
  }, [employees, query])

  const openNew = () => {
    setSelected(null)
    setFormKey((k) => k + 1)
    setModalOpen(true)
  }

  const openEdit = (emp: Employee) => {
    setSelected(emp)
    setModalOpen(true)
  }

  const afterChange = () => {
    setModalOpen(false)
    load()
  }

  return (
    <div className="card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">View/Add Employee</h1>
          <p className="text-xs text-slate-500">Double-click a row to edit (or use the Edit button).</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            className="field-input w-full sm:w-56"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={load} disabled={loading}>Refresh</button>
          <button className="btn btn-primary" onClick={openNew}>Add New</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Emp ID</th>
              <th className="px-3 py-2">Designation</th>
              <th className="px-3 py-2">First Name</th>
              <th className="px-3 py-2">Last Name</th>
              <th className="px-3 py-2">Date of Join</th>
              <th className="px-3 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-slate-400">Loading...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-slate-400">No employees found</td></tr>
            )}
            {!loading &&
              filtered.map((emp) => {
                const fullName = emp.fullName ?? `${emp.firstName ?? ''} ${emp.lastName ?? ''}`.trim()
                const designationName =
                  emp.designationName ??
                  emp.designation_name ??
                  designations.find((d) => d.id === (emp.designationId ?? emp.designation_id))?.name ??
                  '—'

                return (
                  <tr
                    key={emp.id}
                    tabIndex={0}
                    className="cursor-pointer select-none hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                    onDoubleClick={() => openEdit(emp)}
                    onKeyDown={(e) => e.key === 'Enter' && openEdit(emp)}
                  >
                    <td className="px-3 py-2">{emp.id}</td>
                    <td className="px-3 py-2">
                      {designationName}
                      {emp.manager && (
                        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Manager
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 font-medium">{fullName.split(' ')[0] ?? fullName}</td>
                    <td className="px-3 py-2">{fullName.split(' ').slice(1).join(' ') || ''}</td>
                    <td className="px-3 py-2">{emp.dateOfJoin}</td>
                    <td className="px-3 py-2 text-right">
                      <button className="text-sm font-medium text-indigo-600 hover:underline" onClick={() => openEdit(emp)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        title={selected ? `Edit Employee #${selected.id}` : 'Add Employee'}
        onClose={() => setModalOpen(false)}
      >
        <EmployeeForm
          key={selected ? `edit-${selected.id}` : `new-${formKey}`}
          employee={selected}
          designations={designations}
          onSaved={afterChange}
          onDeleted={afterChange}
          onNew={openNew}
        />
      </Modal>
    </div>
  )
}
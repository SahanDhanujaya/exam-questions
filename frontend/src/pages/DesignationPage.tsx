import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { designationApi } from '../api/designationApi'
import { extractError } from '../api/http'
import { useToast } from '../components/Toast'
import { validateDesignation } from '../utils/validation'
import type { Errors } from '../utils/validation'
import type { Designation, DesignationPayload } from '../types'

const empty: DesignationPayload = { name: '', remark: '' }

export default function DesignationPage() {
  const toast = useToast()
  const [items, setItems] = useState<Designation[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<DesignationPayload>(empty)
  const [errors, setErrors] = useState<Errors<DesignationPayload>>({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      setItems(await designationApi.getAll())
    } catch (err) {
      toast('error', extractError(err).message)
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const change = (key: keyof DesignationPayload, value: string) => {
    setForm((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    const found = validateDesignation(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSaving(true)
    try {
      await designationApi.create({ name: form.name.trim(), remark: form.remark.trim() })
      toast('success', 'Designation saved')
      setForm(empty)
      await load()
    } catch (err) {
      const apiErr = extractError(err)
      if (apiErr.fieldErrors) setErrors(apiErr.fieldErrors as Errors<DesignationPayload>)
      toast('error', apiErr.message)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setForm(empty)
    setErrors({})
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={handleSave} noValidate className="card space-y-4 lg:col-span-2 lg:self-start">
        <h1 className="text-xl font-semibold">Add New Designation</h1>

        <div>
          <label className="field-label" htmlFor="dname">Designation Name</label>
          <input
            id="dname"
            className="field-input"
            value={form.name}
            aria-invalid={!!errors.name}
            onChange={(e) => change('name', e.target.value)}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="dremark">Remark</label>
          <input
            id="dremark"
            className="field-input"
            value={form.remark}
            aria-invalid={!!errors.remark}
            onChange={(e) => change('remark', e.target.value)}
          />
          {errors.remark && <p className="field-error">{errors.remark}</p>}
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={saving}>Reset</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>

      <div className="card lg:col-span-3">
        <h2 className="mb-3 text-lg font-semibold">Designations</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Id</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr><td colSpan={3} className="px-3 py-6 text-center text-slate-400">Loading...</td></tr>
              )}
              {!loading && items.length === 0 && (
                <tr><td colSpan={3} className="px-3 py-6 text-center text-slate-400">No designations yet</td></tr>
              )}
              {items.map((d) => (
                <tr key={d.id}>
                  <td className="px-3 py-2">{d.id}</td>
                  <td className="px-3 py-2 font-medium">{d.name ?? d.designationName ?? d.designation ?? '—'}</td>
                  <td className="px-3 py-2 text-slate-500">{d.remark ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
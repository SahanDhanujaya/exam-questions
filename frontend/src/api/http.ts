import axios from 'axios'
import type { AxiosError } from 'axios'
import type { ApiError } from '../types'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
})

export function extractError(err: unknown): ApiError {
  const e = err as AxiosError<ApiError>
  if (e.response?.data?.message) return e.response.data
  if (e.request) return { message: 'Cannot reach the server. Is the backend running?' }
  return { message: 'Unexpected error occurred' }
}

export function unwrapList<T>(payload: unknown, fallbackKey?: string): T[] {
  if (Array.isArray(payload)) return payload as T[]

  if (!payload || typeof payload !== 'object') return []

  const record = payload as Record<string, unknown>

  const candidates = [
    record.data,
    record.items,
    record.result,
    record.records,
    record.designations,
    record.employees,
    fallbackKey ? record[fallbackKey] : undefined,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as T[]
  }

  return []
}
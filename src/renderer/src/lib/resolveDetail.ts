import type { DetailDescriptor } from '@/posture/hybrid-classifier'

const NESTED_KEYS = ['clinicalKey', 'personalKey'] as const

type Translator = (key: string, values?: Record<string, unknown>) => string

export function resolveDetail(t: Translator, descriptor: DetailDescriptor): string {
  return resolveDetailInner(t, descriptor, false)
}

function resolveDetailInner(
  t: Translator,
  descriptor: DetailDescriptor,
  inNested: boolean
): string {
  const v = descriptor.values ?? {}
  const resolved: Record<string, unknown> = {}

  for (const [k, val] of Object.entries(v)) {
    if ((NESTED_KEYS as readonly string[]).includes(k)) continue
    resolved[k] = val
  }

  if (typeof v.metricKey === 'string') resolved.metric = t(v.metricKey)

  if (!inNested && typeof v.clinicalKey === 'string') {
    resolved.clinical = resolveDetailInner(
      t,
      { key: v.clinicalKey, values: stripNested(v) as Record<string, string | number> },
      true
    )
  }

  if (!inNested && typeof v.personalKey === 'string') {
    resolved.personal = t(v.personalKey).toLowerCase()
  }

  return t(descriptor.key, resolved)
}

function stripNested(v: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, val] of Object.entries(v)) {
    if ((NESTED_KEYS as readonly string[]).includes(k)) continue
    out[k] = val
  }
  return out
}

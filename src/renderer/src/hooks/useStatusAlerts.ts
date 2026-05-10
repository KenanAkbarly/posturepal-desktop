import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { PostureMetrics, PostureStatus } from '@/posture/types'
import type { HybridClassification } from '@/posture/hybrid-classifier'
import {
  CLINICAL_METRIC_INFO,
  CLINICAL_THRESHOLDS,
  type ClinicalMetric
} from '@/posture/clinical-thresholds'
import { api } from '@/lib/ipc'

export interface UseStatusAlertsOptions {
  notifications: boolean
  sound: boolean
}

interface AlertContext {
  metrics: PostureMetrics | null
  classification: HybridClassification | null
}

/**
 * Watches `status` for transitions away from 'good' and fires native
 * notifications + optional sound. The notification body is built from
 * the live classification so the user sees the actual offending metric
 * and value (e.g. "CVA 41° — clinical threshold 45°"). No cooldown
 * beyond the natural smoothing+hysteresis already applied upstream:
 * each distinct break (good → poor) gets one notification.
 */
export function useStatusAlerts(
  status: PostureStatus,
  context: AlertContext,
  { notifications, sound }: UseStatusAlertsOptions
): void {
  const { t } = useTranslation()
  const previousStatusRef = useRef<PostureStatus>('good')
  const contextRef = useRef<AlertContext>(context)

  useEffect(() => {
    contextRef.current = context
  }, [context])

  useEffect(() => {
    const previous = previousStatusRef.current
    previousStatusRef.current = status

    if (status === 'good' || status === previous) return
    const level = status as 'warning' | 'poor'
    const ctx = contextRef.current

    if (notifications) {
      const payload = buildNotificationPayload(level, ctx, t)
      void api.notifyPosture(payload)
    }
    if (sound && level === 'poor') void api.playAlertSound()
  }, [status, notifications, sound, t])
}

function buildNotificationPayload(
  level: 'warning' | 'poor',
  ctx: AlertContext,
  t: (key: string, values?: Record<string, unknown>) => string
): { title: string; subtitle?: string; body: string } {
  const titleKey = level === 'poor' ? 'notifications.poor.title' : 'notifications.warning.title'
  const title = t(titleKey)

  const metric = pickWorstClinicalMetric(ctx.classification)
  if (metric && ctx.metrics) {
    const info = CLINICAL_METRIC_INFO[metric]
    const value = info.format(ctx.metrics[metric])
    const cutoff = `${CLINICAL_THRESHOLDS[metric].poor}${info.unit}`
    const op = metric === 'shoulderAsymmetry' ? '>' : '<'
    const metricLabel = t(`notifications.metric.${metric === 'shoulderAsymmetry' ? 'asymmetry' : metric}`)
    const body = t('notifications.body.clinical', {
      metric: metricLabel,
      value,
      op,
      cutoff
    })
    return { title, subtitle: t(`notifications.${level}.subtitle`), body }
  }

  // No baseline / no clinical breach (rare for a 'poor' alert) — fall back
  // to a generic body. Still rich title + subtitle.
  return {
    title,
    subtitle: t(`notifications.${level}.subtitle`),
    body: t('notifications.body.generic')
  }
}

function pickWorstClinicalMetric(c: HybridClassification | null): ClinicalMetric | null {
  if (!c) return null
  return c.clinical.worstMetric
}

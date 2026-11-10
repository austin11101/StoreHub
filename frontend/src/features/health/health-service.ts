import { apiRequest } from '../../lib/api-client'

export interface LivenessResponse {
  status: 'ok'
  service: 'commercehub-api'
}

export interface ReadinessResponse {
  status: 'ok' | 'error'
  dependencies: {
    database: 'ok' | 'unavailable'
  }
}

export function getLiveness(): Promise<LivenessResponse> {
  return apiRequest<LivenessResponse>('health/live')
}

export function getReadiness(): Promise<ReadinessResponse> {
  return apiRequest<ReadinessResponse>('health/ready')
}

import axios from 'axios'

export interface SchedulePayload {
  walkerId: number
  date: string
  fromTime: string
  toTime: string
  location: string
}

export interface ScheduleResponse {
  success: boolean
  message?: string
}

export async function bookSchedule(payload: SchedulePayload): Promise<ScheduleResponse> {
  try {
    const response = await axios.post<ScheduleResponse>('/api/schedule', payload)
    return response.data
  } catch (error: any) {
    console.error('Schedule booking error:', error)
    return { success: false, message: 'Network or server error' }
  }
}

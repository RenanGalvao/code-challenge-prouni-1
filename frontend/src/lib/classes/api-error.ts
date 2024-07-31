import type { ApiResponse } from '@/lib/types/index.js'

export class ApiError extends Error {
  data: any
  timestamp: string
  status: number

  constructor(apiResponse: ApiResponse, status = 0) {
    super(apiResponse.message)
    this.data = apiResponse.data
    this.timestamp = apiResponse.timestamp
    this.status = status
  }
}

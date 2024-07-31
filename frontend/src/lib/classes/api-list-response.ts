import { generateMessages } from '@/lib/utils/index.js'
import type { Message, ApiResponse as ApiResponseType } from '@/lib/types/index.js'

type ApiListResponseInfo = {
  status: number
  totalCount: number
  totalPages: number
}

export class ApiListResponse<T> {
  messages: Message[]
  data: T[]
  timestamp: string
  info: ApiListResponseInfo

  constructor(apiData: ApiResponseType, info: ApiListResponseInfo) {
    this.info = info
    this.messages = generateMessages([
      { message: apiData.message, variant: info.status >= 400 ? 'danger' : 'success', silent: true }
    ])
    this.data = apiData.data
    this.timestamp = apiData.timestamp
  }
}

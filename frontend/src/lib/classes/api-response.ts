import { generateMessages } from '@/lib/utils/index.js'
import type { Message, ApiResponse as ApiResponseType } from '@/lib/types/index.js'

export class ApiResponse<T> {
  messages: Message[]
  data: T
  timestamp: string
  status: number

  constructor(apiData: ApiResponseType, status = 200) {
    this.status = status
    this.messages = generateMessages([
      { message: apiData.message, variant: status >= 400 ? 'danger' : 'success' }
    ])
    this.data = apiData.data
    this.timestamp = apiData.timestamp
  }
}

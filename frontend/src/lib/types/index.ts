export type Task = {
  id: number
  description: string
  done: number
  createdAt: string
  updatedAt: string | null
}

export type TodoItem = {
  id?: number
  description: string
  done: boolean,
  _vForKey: number
}

export type EasyFetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type EasyFetchOptions = {
  url: RequestInfo
  method?: EasyFetchMethod
  headers?: { [key: string]: any }
  body?: any
  isJson?: boolean
}

export type ApiResponse = {
  message: string
  data: any
  timestamp: string
}

export type GenerateMessagesOptions = {
  id?: number
  message: string
  variant?: 'danger' | 'success' | 'info'
  silent?: boolean
  duration?: number
}

export type Message = {
  id: number
  message: string
  variant: 'danger' | 'success' | 'info'
  silent?: boolean
  duration: number
  delay?: number
}

export type Pagination = {
  itemsPerPage?: number
  page?: number
}


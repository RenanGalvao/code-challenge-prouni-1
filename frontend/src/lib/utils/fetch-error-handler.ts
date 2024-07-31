import { ApiError } from '@/lib/classes/api-error'
import { generateMessages } from '@/lib/utils'
import { ValidationError } from 'yup'

export function fetchErrorHandler(err: any) {
  // error instanceof ApiError
  if (err instanceof ApiError) {
    // DTO Error
    if (err.status === 400) {
      if (Object.keys(err.data).length > 0) {
        const data = []
        // {[key: string]: string[]}
        for (const [_, value] of Object.entries(err.data)) {
          data.push(...(value as string[]))
        }
        return {
          messages: generateMessages(data.map((err: any) => ({ message: err })))
        }
      } else {
        return {
          messages: generateMessages([{ message: err.message }])
        }
      }
    } else {
      return {
        messages: generateMessages([{ message: err.message }])
      }
    }
  } else if (err instanceof ValidationError) {
    return {
      messages: generateMessages(err.inner.map((err) => ({ message: err.message })))
    }
  }

  // fallback
  return {
    messages: generateMessages([{ message: err.message }])
  }
}

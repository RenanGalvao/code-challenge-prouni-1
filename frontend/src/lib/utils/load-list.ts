import {
  fromSearchToPagination,
  fromPaginationToQuery,
  fetchErrorHandler,
  easyFetch
} from '@/lib/utils'
import { ApiError, ApiListResponse } from '@/lib/classes/index.js'
import type { Message } from '@/lib/types/index.js'

export async function loadList<T>(path: string, url: URL): Promise<ApiListResponse<T> | { messages: Message[] } | undefined> {
  // do not trust user input
  const pagination = fromSearchToPagination(url)
  const queryString = fromPaginationToQuery(pagination)

  try {
    const res = await easyFetch({
      url: `${import.meta.env.VITE_API_URL}${path}?${queryString}`
    })

    if (res instanceof Error) {
      throw res
    }

    if (res instanceof Response) {
      if (res.status !== 200) {
        throw new ApiError(await res.json(), res.status)
      }

      return new ApiListResponse<T>(await res.json(), {
        status: 200,
        totalCount: Number(res.headers.get('x-total-count')),
        totalPages: Number(res.headers.get('x-total-pages'))
      })
    }
  } catch (err) {
    return fetchErrorHandler(err)
  }
}

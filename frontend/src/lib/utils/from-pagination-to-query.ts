import type { Pagination } from '@/lib/types/index.js'

export function fromPaginationToQuery(pagination: Pagination) {
  const urlSearchParams = new URLSearchParams()
  for (const key of Object.keys(pagination) as Array<keyof typeof pagination>) {
    if (pagination[key]) {
      urlSearchParams.set(key, String(pagination[key]))
    }
  }
  return urlSearchParams.toString()
}

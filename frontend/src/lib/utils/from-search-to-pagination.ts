import { DEFAULT_ITEMS_PER_PAGE } from '@/const/index.js'

export function fromSearchToPagination(url: URL) {
  return {
    itemsPerPage: Number(url.searchParams.get('itemsPerPage')) || DEFAULT_ITEMS_PER_PAGE,
    page: Number(url.searchParams.get('page')) || 1
  }
}

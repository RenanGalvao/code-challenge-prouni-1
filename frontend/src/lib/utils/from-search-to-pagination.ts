export function fromSearchToPagination(url: URL) {
  return {
    itemsPerPage: Number(url.searchParams.get('itemsPerPage')) || 20,
    page: Number(url.searchParams.get('page')) || 1
  }
}

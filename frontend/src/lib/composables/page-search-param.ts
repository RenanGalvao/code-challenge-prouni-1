import { ref } from 'vue'

export function usePageSearchParam() {
    const isWindowDefined = typeof window !== 'undefined'
    const url = isWindowDefined ? new URL(window.location.href) : new URL(import.meta.env.VITE_APP_ORIGIN)
    const page = ref(
        url.searchParams.get('page') && !Number.isNaN(Number(url.searchParams.get('page')))
            ? Number(url.searchParams.get('page'))
            : 1
    )

    const setPageSearchParam = (value: number) => {
        page.value = value
        let search = isWindowDefined ? window.location.search : ''
        if (search.length > 0 && search.indexOf('page')) {
            search = search.replace(/page=\d+/, `page=${value}`)
        } else {
            search = `?page=${value}`
        }

        if (isWindowDefined) {
            window.history.replaceState(null, '', search)
        }
    }

    return { page, setPageSearchParam }
}
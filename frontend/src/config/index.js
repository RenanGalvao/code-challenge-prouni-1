import 'dotenv/config'

export default {
    app: {
        isProduction: process.env.NODE_ENV === 'production',
        port: process.env.PORT || 3010,
        base: process.env.BASE || '/'
    },
    /*rateLimiter: {
        global: {
            points: 5,
            duration: 1 // seconds
        } as IRateLimiterOptions,
        authLogin: {
            points: 10,
            duration: 60 * 60 // 1 hour in secs
        } as IRateLimiterOptions,
    },*/
}
import 'dotenv/config'
import { IRateLimiterOptions } from 'rate-limiter-flexible'

export default {
    app: {
        isProduction: process.env.NODE_ENV === 'production',
        port: process.env.VITE_APP_PORT || 3010,
        base: process.env.BASE || '/'
    },
    rateLimiter: {
        global: {
            points: 5,
            duration: 1 // seconds
        } as IRateLimiterOptions,
    },
}
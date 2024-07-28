import 'dotenv/config'
import { IRateLimiterOptions } from 'rate-limiter-flexible'

export default {
    app: {
        port: process.env.PORT ?? 3000
    },
    rateLimiter: {
        global: {
            points: 5,
            duration: 1 // seconds
        } as IRateLimiterOptions,
        authLogin: {
            points: 10,
            duration: 60 * 60 // 1 hour in secs
        } as IRateLimiterOptions,
    }
}
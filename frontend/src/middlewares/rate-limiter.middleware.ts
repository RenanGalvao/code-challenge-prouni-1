import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'
import config from '@/config'
import { Request, Response, NextFunction } from 'express'
import { HTTP_ERROR_CODES } from '@/const'

const globalRateLimiter = new RateLimiterMemory(config.rateLimiter.global)

export async function RateLimiter(req: Request, res: Response, next: NextFunction) {
    const ipAddress = req.ip ?? ''
    let rateLimiterRes: RateLimiterRes | null
    let retrySecs = 0

    rateLimiterRes = await globalRateLimiter.get(ipAddress)
    if (rateLimiterRes !== null && rateLimiterRes.consumedPoints > config.rateLimiter.global.points!) {
        retrySecs = Math.round(rateLimiterRes.msBeforeNext / 1000) || 1
    }

    if (retrySecs > 0) {
        res.set('Retry-After', String(retrySecs))
        next(new Error(HTTP_ERROR_CODES.TOO_MANY_REQUESTS))
        return
    }

    try {
        rateLimiterRes = await globalRateLimiter.consume(ipAddress)
        res.set('X-RateLimit-Limit', String(config.rateLimiter.global.points!))
    } catch (err) {
        if (err instanceof RateLimiterRes) {
            res.set('Retry-After', String(Math.round(err.msBeforeNext / 1000) || 1))
            next(new Error(HTTP_ERROR_CODES.TOO_MANY_REQUESTS))
            return
        }
        next(err)
        return
    }

    res.set('X-RateLimit-Remaining', String(rateLimiterRes?.remainingPoints))
    res.set('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes!.msBeforeNext).toISOString())
    next()
}


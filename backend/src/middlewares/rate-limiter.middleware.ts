import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'
import config from '@src/config'
import { Request, Response, NextFunction } from 'express'
import { HTTP_ERROR_CODES } from '@src/const'

const globalRateLimiter = new RateLimiterMemory(config.rateLimiter.global)
const authLoginRateLimiter = new RateLimiterMemory(config.rateLimiter.authLogin)
const authLoginPath = '/auth/sign-in'

export async function RateLimiter(req: Request, res: Response, next: NextFunction) {
    const ipAddress = req.ip ?? ''
    let rateLimiterRes: RateLimiterRes | null
    let retrySecs = 0

    if (req.path.indexOf(authLoginPath) >= 0) {
        rateLimiterRes = await authLoginRateLimiter.get(ipAddress)
        if (rateLimiterRes !== null && rateLimiterRes.consumedPoints > config.rateLimiter.authLogin.points!) {
            retrySecs = Math.round(rateLimiterRes.msBeforeNext / 1000) || 1
        }
    } else {
        rateLimiterRes = await globalRateLimiter.get(ipAddress)
        if (rateLimiterRes !== null && rateLimiterRes.consumedPoints > config.rateLimiter.global.points!) {
            retrySecs = Math.round(rateLimiterRes.msBeforeNext / 1000) || 1
        }
    }


    if (retrySecs > 0) {
        res.set('Retry-After', String(retrySecs))
        next(new Error(HTTP_ERROR_CODES.TOO_MANY_REQUESTS))
        return
    }

    try {
        if (req.path.indexOf(authLoginPath) >= 0) {
            rateLimiterRes = await authLoginRateLimiter.consume(ipAddress)
            res.set('X-RateLimit-Limit', String(config.rateLimiter.authLogin.points!))
        } else {
            rateLimiterRes = await globalRateLimiter.consume(ipAddress)
            res.set('X-RateLimit-Limit', String(config.rateLimiter.global.points!))
        }
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


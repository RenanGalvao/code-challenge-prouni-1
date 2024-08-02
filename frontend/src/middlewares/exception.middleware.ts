import { Request, Response, NextFunction } from 'express'
import { logger } from '@/utils/index.js'
import { HTTP_ERROR_CODES } from '@/const/index.js'
import { readFileSync } from 'fs'

export function ExceptionHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err)
    }

    switch (err.message) {
        case HTTP_ERROR_CODES.BAD_REQUEST:
            res.status(400)
            break
        case HTTP_ERROR_CODES.NOT_FOUND:
            res.status(404)
            break
        case HTTP_ERROR_CODES.TOO_MANY_REQUESTS:
            res.status(429)
            break;
        default:
            logger.warn(err)
            res.status(500)
    }

    const template = readFileSync('./error.html', 'utf-8')
    const html = template.replace('<!--error-->', err.message)
    res.set({ 'Content-Type': 'text/html' }).end(html)

    next()
}
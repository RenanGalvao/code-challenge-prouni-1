import { Request, Response, NextFunction } from 'express'
import { HTTP_ERROR_CODES } from '@src/const'
import { ValidationError } from 'class-validator'
import { logger } from '@src/utils'

export function ExceptionHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err)
    }

    // Body/Query Validation 
    if (Array.isArray(err) && err[0] instanceof ValidationError) {
        let data = {} as any

        // collects all error messages from class-validator in a [key: string]: string object
        for (const error of err as ValidationError[]) {
            error.constraints
            data[error.property] = Object.entries(error.constraints!).reduce((prev: string[], curr) => {
                return [...prev, curr[1]]
            }, [])
        }

        res.status(400).json({
            message: 'Erro na validação!',
            data,
            timestamp: new Date().toISOString()
        })
        return
    }

    switch (err.message) {
        case 'invalid signature': //JsonWebTokenError
        case HTTP_ERROR_CODES.BAD_REQUEST:
            res.status(400)
            break
        case 'jwt not active': //NotBeforeError
        case 'jwt expired': //TokenExpiredError
        case HTTP_ERROR_CODES.UNAUTHORIZED:
            res.status(401)
            break
        case HTTP_ERROR_CODES.FORBIDDEN:
            res.status(403)
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
    if (err.message) {
        res.json({
            message: err.message,
            data: {},
            timestamp: new Date().toISOString()
        })
    }

    next()
}
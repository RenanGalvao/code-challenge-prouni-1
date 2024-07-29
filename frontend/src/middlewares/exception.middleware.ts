import { Request, Response, NextFunction } from 'express'
import { logger } from '@/utils'

export function ExceptionHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err)
    }

    // @TODO
    // TEMPLATE SAME AS SERVER, EXPORT FUNCTION FROM THERE
    if (err.message) {
        logger.warn(err)
        res.json({
            message: err.message,
            data: {},
            timestamp: new Date().toISOString()
        })
    }

    next()
}
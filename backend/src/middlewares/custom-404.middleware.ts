import { Request, Response, NextFunction } from 'express'
import { HTTP_ERROR_CODES } from '@src/const'

export function Custom404(req: Request, res: Response, next: NextFunction) {
    res.status(404).json({
        message: HTTP_ERROR_CODES.NOT_FOUND,
        data: {},
        timestamp: new Date().toISOString()
    })
}
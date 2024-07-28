import { Request, Response, NextFunction } from 'express'
import { HealthService } from './health.service'
import { formatResponse } from '@src/utils'

function health(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(formatResponse(req, res, HealthService.health()))
    } catch (err) {
        next(err)
    }
}

export const HealthController = { health }
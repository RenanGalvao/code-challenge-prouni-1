import { Request, Response, NextFunction } from 'express'

export function ValidateParam(paramName: string, validation: RegExp) {
    return function (req: Request, res: Response, next: NextFunction) {
        const paramValue = req.params[paramName] ?? ''
        if (!paramValue || !validation.test(paramValue)) {
            res.status(400).json({
                message: 'Erro na validação!',
                data: {
                    [`:${paramName}`]: `O valor deve corresponder ao regex: ${validation}`
                },
                timestamp: new Date().toISOString()
            })
        } else {
            next()
        }
    }
}
import { Request, Response, NextFunction } from 'express'
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer'

export function ValidateBody(dto: any) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            // options remove unexposed properties and undefined values from final instance
            const body: any = plainToInstance(dto, req.body, { excludeExtraneousValues: true, exposeUnsetFields: false })
            req.body = body
            await validateOrReject(body)
        } catch (errs) {
            next(errs)
        }
        next()
    }
}
import { Request, Response, NextFunction } from 'express'
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer'

export function ValidateQuery(dto: any) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            // options remove unexposed properties and undefined values from final instance
            const query: any = plainToInstance(dto, req.query, { excludeExtraneousValues: true, exposeUnsetFields: false })
            req.query = query
            await validateOrReject(query)
        } catch (errs) {
            next(errs)
        }
        next()
    }
}
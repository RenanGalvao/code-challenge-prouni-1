import { Request, Response, NextFunction } from 'express'

export function Custom404(req: Request, res: Response, next: NextFunction) {
    //@ TODO
    // TEMPLATE SAME AS SERVER, EXPORT FUNCTION FROM THERE
    res.status(404).send('404')
}
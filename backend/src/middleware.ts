import { z, ZodError } from 'zod'

import { NextFunction, Request, Response } from 'express'


type Middleware<P = any, R = any, B = any> = (req: Request<P, R, B>, res: Response, next: NextFunction) => void


export function validateBody<B>(schema: z.Schema<B>): Middleware<any, any, B> {
    return (req, res, next) => {
        console.log(req.body)

        try {
            schema.parse(req.body)
        }
        catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send({
                    message: 'Validation error',
                    error: error.issues
                })
                return
            }
            next(error)
        }

        next()
    }
}
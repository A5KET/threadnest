import { z, ZodError } from 'zod'

import { NextFunction, Request, Response } from 'express'
import multer from 'multer'


type Middleware<P = any, R = any, B = any> = (req: Request<P, R, B>, res: Response, next: NextFunction) => void


export function parseBodyFields(fields: string[]): Middleware {
    return function (req, res, next) {
        for (const field of fields) {
            const fieldValue = req.body[field]

            if (!fieldValue) {
                console.error('Missing parsed field', field)

                res.status(400).send({
                    message: `Failed body field '${field}' parsing`,
                    error: `'${field}' is undefined`
                })

                return
            }

            try {
                req.body[field] = JSON.parse(req.body[field])
            } catch (error) {
                res.status(400).send({
                    message: `Failed body field '${field}' parsing`,
                    error: (error as SyntaxError).message
                })

                return
            }
        }

        next()
    }
}


export function validateBody<B>(schema: z.Schema<B>): Middleware<any, any, B> {
    return async function (req, res, next) {
        try {
            await schema.parseAsync(req.body)
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


export function validateFiles<F extends Express.Multer.File[] | undefined, R extends Request & { files: F }>(schema: z.Schema<F>): Middleware<any, R> {
    return async function (req, res, next) {
        try {
            await schema.parseAsync(req.files)
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).send({
                    message: 'Files validation error',
                    error: error.issues
                })

                return
            }

            next(error)
        }

        next()
    }
}


export function handleError(err: any, req: Request, res: Response, next: (err: any) => void) {
    console.error(err)
    if (err instanceof ZodError) {
        res.status(400).send({ error: err.issues })
        return
    }
    if (err instanceof multer.MulterError) {
        res.status(400).send({ error: err })
        return
    }

    next(err)
}
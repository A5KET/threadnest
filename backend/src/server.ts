import cors from 'cors'
import express from 'express'

import { handleError } from './middleware'
import getCommentsRoutes from './routes/comments'
import { StaticService, Upload } from './types'


export function createServer(
    attachmentUpload: Upload,
    staticService: StaticService
) {
    const server = express()

    server.use(cors())
    server.use('/static', express.static(staticService.staticRoot, { maxAge: '1y', immutable: true }))
    server.use(express.json())
    server.use('/comments', getCommentsRoutes(attachmentUpload, staticService), handleError)
    server.use(handleError)

    return server
}
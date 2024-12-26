import express from 'express'
import cors from 'cors'

import messageRoutes from './routes/message'


export function createServer() {
    const server = express()

    server.use(express.json())
    server.use(cors())
    server.use('/messages', messageRoutes)

    return server
}
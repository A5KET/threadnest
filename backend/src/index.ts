import { createServer } from './server'

const PORT = 3000

const server = createServer()


server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})

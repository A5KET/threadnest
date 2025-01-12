import { createServer } from './server'
import { createAttachmentUpload as createStaticStorage, DiskStaticService } from './static'


const PORT = 3000
const staticRoot = process.env.STATIC_PATH!


const staticService = new DiskStaticService(staticRoot)
const attachmentUpload = createStaticStorage(staticRoot)
const server = createServer(attachmentUpload, staticService)

server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})

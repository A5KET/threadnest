import fs from 'fs/promises'
import multer from 'multer'
import { StaticService } from './types'
import { allowedAttachmentFileExtensions, allowedAttachmentFileMimeTypes, mimeTypeToAttachmentMetadata } from 'common/attachments'


export function createAttachmentUpload(staticRoot: string) {
    const storage = multer.memoryStorage()

    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1 * 1024 * 1024,
        },
        fileFilter: async (req, file, cb) => {
            if (!allowedAttachmentFileMimeTypes.includes(file.mimetype)) {
                cb(new Error(`Invalid file type. Allowed: ${allowedAttachmentFileExtensions.join(', ')}`))
                return
            }

            cb(null, true)
        }
    })

    return upload
}


export class DiskStaticService implements StaticService {
    constructor(readonly staticRoot: string) { }

    getFileType(file: Express.Multer.File) {
        return mimeTypeToAttachmentMetadata[file.mimetype]?.type || ''
    }

    getRelativeFilePath(file: Express.Multer.File) {
        const timestamp = new Date().getTime()

        return `${timestamp}_${file.originalname}`
    }

    getAbsoluteFileWritePath(relativePath: string) {
        return `${this.staticRoot}/${relativePath}`
    }

    async saveFile(file: Express.Multer.File) {
        const relativePath = this.getRelativeFilePath(file)
        const writePath = this.getAbsoluteFileWritePath(relativePath)

        await fs.writeFile(writePath, file.buffer)

        return {
            path: relativePath,
            name: file.originalname,
            mimetype: file.mimetype
        }
    }
}
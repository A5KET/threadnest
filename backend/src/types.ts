import { Comment } from 'common/types'
import { Multer } from 'multer'
export type { Comment }


export type Upload = Multer

export interface SavedFile {
    name: string
    path: string
    mimetype: string
}


export interface StaticService {
    readonly staticRoot: string
    saveFile(file: Express.Multer.File): Promise<SavedFile>
}
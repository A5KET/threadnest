export interface NewAttachment {
    name: string
    path: string
    mimetype: string
}

export interface Attachment extends NewAttachment {
    id: number
    createdAt: Date | string
}

export interface User {
    id: number
    username: string
    email: string
    homepage: string | null
}

export interface Message {
    id: number
    parentId: number | null
    children?: Message[]
    attachments: Attachment[]
    hasChildren: boolean
    author: User
    text: string
    createdAt: Date | string
}

export interface NewAuthor {
    username: string
    email: string
    homepage?: string
}

export interface MessageDto {
    parentId?: number
    text: string
    author: NewAuthor
}

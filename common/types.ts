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

export interface Comment {
    id: number
    parentId: number | null
    children?: Comment[]
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

export interface CommentDto {
    parentId?: number
    text: string
    author: NewAuthor
}

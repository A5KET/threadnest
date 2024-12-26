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


export interface NewMessage {
    text: string
    author: NewAuthor
}

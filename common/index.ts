export interface User {
    username: string
}

export interface Message {
    id: number
    parentId: number | null
    author: User
    text: string
    createdAt: Date
}
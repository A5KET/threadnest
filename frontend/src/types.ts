export interface Message {
    id: number
    parentId: number | null
    author: User
    text: string
    createdAt: Date
    rating: number
    reaction: 'like' | 'dislike'
}

export interface User {
    username: string
}


export interface MessageNode extends Message {
    children: MessageNode[]
}
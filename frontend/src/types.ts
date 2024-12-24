export type MessageReaction = 'like' | 'dislike' | null

export interface Message {
    id: number
    parentId: number | null
    author: User
    text: string
    createdAt: Date
    rating: number
    reaction: MessageReaction
}

export interface NewMessage {
    username: string
    email: string
    homepage?: string
    text: string
}

export interface User {
    username: string
}

export interface MessageNode extends Message {
    children: MessageNode[]
}

export interface MessageService {
    getMessages(): Promise<Message[]>
    createMessage(message: NewMessage): Promise<Message>
    changeMessageReaction(message: Message, newReaction: MessageReaction): Promise<Message>
}

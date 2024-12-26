import { Message, NewMessage, User } from 'common'

export type { Message, User, NewMessage }


export interface MessageService {
    getMessages(): Promise<Message[]>
    createMessage(message: NewMessage): Promise<Message>
}

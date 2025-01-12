import { Message, MessageDto, User } from 'common/types'

export type { Message, User }


export interface MessageService {
    getMessages(): Promise<Message[]>
    createMessage(message: NewMessage): Promise<Message>
    createReplyMessage(parentMessage: Message, replyMessage: NewMessage): Promise<Message>
}

export interface NewMessage extends MessageDto {
    attachments: File[]
}

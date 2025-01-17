import axios, { AxiosInstance } from 'axios'
import { Attachment } from 'common/types'
import { Message, MessageService, NewMessage } from './types'


interface ApiResponse<D> {
    data: D,
    message?: string
    error?: any
}


export class APIMessageService implements MessageService {
    readonly api: AxiosInstance

    constructor(backendUrl: string) {
        this.api = axios.create({
            baseURL: backendUrl
        })
    }

    createFormDataFromMessage(newMessage: NewMessage) {
        const data = new FormData()

        data.append('message', JSON.stringify(newMessage))

        for (const attachment of newMessage.attachments) {
            data.append('attachments', attachment)
        }

        return data
    }
    async getMessages() {
        const res = await this.api.get<ApiResponse<Message[]>>('/messages')

        console.log(res.data.data)

        return res.data.data
    }

    async createMessage(newMessage: NewMessage) {
        const data = this.createFormDataFromMessage(newMessage)

        const res = await this.api.post<ApiResponse<Message>>('/messages', data)

        return res.data.data
    }

    async createReplyMessage(parentMessage: Message, replyMessage: NewMessage) {
        const message = {
            ...replyMessage,
            parentId: parentMessage.id
        }

        const data = this.createFormDataFromMessage(message)

        const res = await this.api.post<ApiResponse<Message>>(`/messages`, data)

        return res.data.data
    }
}


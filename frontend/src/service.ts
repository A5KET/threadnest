import axios from 'axios'
import { Message, MessageService, NewMessage } from './types'


const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
})


interface ApiResponse<D> {
    data: D,
    message?: string
    error?: any
} 


function createFormDataFromMessage(newMessage: NewMessage) {
    const data = new FormData()

    data.append('message', JSON.stringify(newMessage))

    for (const attachment of newMessage.attachments) {
        data.append('attachments', attachment)
    }

    return data
}


export class APIMessageService implements MessageService {
    async getMessages() {
        const res = await api.get<ApiResponse<Message[]>>('/messages')

        console.log(res.data.data)

        return res.data.data
    }

    async createMessage(newMessage: NewMessage) {
        const data = createFormDataFromMessage(newMessage)

        const res = await api.post<ApiResponse<Message>>('/messages', data)

        return res.data.data
    }

    async createReplyMessage(parentMessage: Message, replyMessage: NewMessage) {
        const message = {
            ...replyMessage,
            parentId: parentMessage.id
        }

        const data = createFormDataFromMessage(message)

        const res = await api.post<ApiResponse<Message>>(`/messages`, data)

        return res.data.data
    }
}
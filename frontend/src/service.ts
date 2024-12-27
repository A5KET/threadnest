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


export class APIMessageService implements MessageService {
    async getMessages() {
        const res = await api.get<ApiResponse<Message[]>>('/messages')

        return res.data.data
    }

    async createMessage(newMessage: NewMessage) {
        const res = await api.post<ApiResponse<Message>>('/messages', newMessage)

        return res.data.data
    }

    async createReplyMessage(parentMessage: Message, replyMessage: NewMessage) {
        const res = await api.post<ApiResponse<Message>>(`/messages/${parentMessage.id}/children`, replyMessage)

        return res.data.data
    }
}
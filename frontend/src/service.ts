import axios, { AxiosInstance } from 'axios'
import { Comment, CommentService, NewComment } from './types'


interface ApiResponse<D> {
    data: D,
    comment?: string
    error?: any
}

export class APICommentService implements CommentService {
    readonly api: AxiosInstance

    constructor(backendUrl: string) {
        this.api = axios.create({
            baseURL: backendUrl
        })
    }

    createFormDataFromComment(newComment: NewComment) {
        const data = new FormData()

        data.append('comment', JSON.stringify(newComment))

        for (const attachment of newComment.attachments) {
            data.append('attachments', attachment)
        }

        return data
    }
    async getComments() {
        const res = await this.api.get<ApiResponse<Comment[]>>('/comments')

        console.log(res.data.data)

        return res.data.data
    }

    async createComment(newComment: NewComment) {
        const data = this.createFormDataFromComment(newComment)

        const res = await this.api.post<ApiResponse<Comment>>('/comments', data)

        return res.data.data
    }

    async createReplyComment(parentComment: Comment, replyComment: NewComment) {
        const comment = {
            ...replyComment,
            parentId: parentComment.id
        }

        const data = this.createFormDataFromComment(comment)

        const res = await this.api.post<ApiResponse<Comment>>(`/comments`, data)

        return res.data.data
    }
}

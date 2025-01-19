import { Comment, CommentDto, User } from 'common/types'

export type { Comment, User }


export interface CommentService {
    getComments(): Promise<Comment[]>
    createComment(comment: NewComment): Promise<Comment>
    createReplyComment(parentComment: Comment, replyComment: NewComment): Promise<Comment>
}

export interface NewComment extends CommentDto {
    attachments: File[]
}

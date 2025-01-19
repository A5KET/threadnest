import { Reply } from 'lucide-react'
import { useState } from 'react'

import { Attachment } from 'common/types'
import { Comment, NewComment } from '../types'
import { createCommentFromFormData, formatDate } from '../utils'
import AttachmentCard from './attachment/AttachmentCard'
import CommentForm, { CommentFormData } from './form/Form'


export interface ThreadCommentProps {
    comment: Comment
    onReply: (parentComment: Comment, replyComment: NewComment) => void
    onAttachmentClick: (attachment: Attachment) => void
}

export default function ThreadComment({ comment, onReply, onAttachmentClick }: ThreadCommentProps) {
    const [isReply, setIsReply] = useState<boolean>(false)
    const { date, time } = formatDate(comment.createdAt)

    const handleReplyClick = () => {
        setIsReply(true)
    }

    const handleReplySubmit = (data: CommentFormData) => {
        const replyComment = createCommentFromFormData(data)

        onReply(comment, replyComment)
        setIsReply(false)
    }

    const handleFormCancel = () => {
        setIsReply(false)
    }

    return (
        <div className='comment'>
            <div className='header'>
                <span className='username'>{comment.author.username}</span>
                <span className='date'>{`${date} в ${time}`}</span>
                <Reply onClick={handleReplyClick} />
            </div>
            <div className='text'>{comment.text}</div>
            {
                comment.attachments
                    ? (
                        <div className='attachments'>
                            {comment.attachments.map(
                                attachment =>
                                    <AttachmentCard
                                        key={attachment.id}
                                        name={attachment.name}
                                        mimetype={attachment.mimetype}
                                        onClick={() => onAttachmentClick(attachment)}
                                    />
                            )}
                        </div>
                    )
                    : null
            }

            {
                isReply
                    ? <CommentForm onSubmit={handleReplySubmit} onCancel={handleFormCancel} />
                    : null
            }
            {
                comment.children
                    ? comment.children.map(childComment => {
                        return <ThreadComment
                            key={childComment.id}
                            comment={childComment}
                            onReply={onReply}
                            onAttachmentClick={onAttachmentClick}
                        />
                    })
                    : (
                        comment.hasChildren
                            ? <p>Show more</p>
                            : null
                    )
            }
        </div>
    )
}
import { Reply } from 'lucide-react'
import { useState } from 'react'

import { Message, NewMessage } from '../types'
import { createMessageFromFormData, formatDate } from '../utils'
import AttachmentCard from './attachment/AttachmentCard'
import MessageForm, { MessageFormData } from './form/Form'


export interface ThreadMessageProps {
    message: Message
    onReply: (parentMessage: Message, replyMessage: NewMessage) => void
}

export default function ThreadMessage({ message, onReply }: ThreadMessageProps) {
    const [isReply, setIsReply] = useState<boolean>(false)
    const { date, time } = formatDate(message.createdAt)

    const handleReplyClick = () => {
        setIsReply(true)
    }

    const handleReplySubmit = (data: MessageFormData) => {
        const replyMessage = createMessageFromFormData(data)

        onReply(message, replyMessage)
        setIsReply(false)
    }

    const handleFormCancel = () => {
        setIsReply(false)
    }

    return (
        <div className='message'>
            <div className='header'>
                <span className='username'>{message.author.username}</span>
                <span className='date'>{`${date} в ${time}`}</span>
                <Reply onClick={handleReplyClick} />
            </div>
            <div className='text'>{message.text}</div>
            {
                message.attachments
                    ? (
                        <div className='attachments'>
                            {message.attachments.map(
                                attachment =>
                                    <AttachmentCard
                                        key={attachment.id}
                                        name={attachment.name}
                                        mimetype={attachment.mimetype}
                                    />
                            )}
                        </div>
                    )
                    : null
            }

            {
                isReply
                    ? <MessageForm onSubmit={handleReplySubmit} onCancel={handleFormCancel} />
                    : null
            }
            {
                message.children
                    ? message.children.map(childMessage => {
                        return <ThreadMessage key={childMessage.id} message={childMessage} onReply={onReply} />
                    })
                    : (
                        message.hasChildren
                            ? <p>Show more</p>
                            : null
                    )
            }
        </div>
    )
}
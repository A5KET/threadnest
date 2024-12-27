import { useState } from 'react'
import { Reply } from 'lucide-react'

import { Message, NewMessage } from '../types'
import { createMessageFromFormData, formatDate } from '../utils'
import MessageForm, { MessageFormData } from './MessageForm'


export interface ThreadMessageProps {
    message: Message
    onReply: (parentMessage: Message, replyMessage: NewMessage) => void
}

export default function ThreadMessage({ message, onReply }: ThreadMessageProps) {
    const [ isReply, setIsReply ] = useState<boolean>(false)
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
                isReply 
                    ? <MessageForm onSubmit={handleReplySubmit} onCancel={handleFormCancel} />
                    : null
            }
            {
                message.children
                    ? message.children.map(childMessage => {
                        return <ThreadMessage key={childMessage.id} message={childMessage} onReply={onReply}/>
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
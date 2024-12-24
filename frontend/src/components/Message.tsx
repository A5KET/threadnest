import { Message, MessageNode, MessageReaction } from '../types'
import { formatDate } from '../utils'
import { MoveDown, MoveUp } from 'lucide-react'


export interface MessageRatingProps {
    rating: number
    reaction: MessageReaction
    onReaction: (reaction: MessageReaction) => void
}

function MessageRating({ rating, reaction, onReaction }: MessageRatingProps) {
    const handleReaction = (newReaction: MessageReaction) => {
        if (newReaction === reaction) {
            onReaction(null)
            return
        }
        
        onReaction(newReaction)
    }

    return (
        <div className='message-rating' >
            <MoveUp className={`like ${reaction === 'like' ? 'active' : ''}`} onClick={() => handleReaction('like')}/>
            <div className='rating'>{rating}</div>
            <MoveDown className={`dislike ${reaction === 'dislike' ? 'active' : ''}`} onClick={() => handleReaction('dislike')}/>
        </div>
    )
}

export interface ThreadMessageProps {
    message: MessageNode,
    onReaction: (message: Message, newReaction: MessageReaction) => void
}

export default function ThreadMessage({ message, onReaction: onReaction }: ThreadMessageProps) {
    const { date, time } = formatDate(message.createdAt)

    return (
        <div className='message'>
            <div className='header'>
                <span className='username'>{message.author.username}</span>
                <span className='date'>{`${date} в ${time}`}</span>
                <MessageRating rating={message.rating} reaction={message.reaction} onReaction={(reaction) => onReaction(message, reaction)} />
            </div>
            <div className='text'>{message.text}</div>
            {message.children.map(childMessage => <ThreadMessage key={childMessage.id} message={childMessage} onReaction={onReaction}/>)}
        </div>
    )
}
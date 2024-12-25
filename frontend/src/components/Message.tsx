import { MessageNode } from '../types'
import { formatDate } from '../utils'


export interface ThreadMessageProps {
    message: MessageNode,
}

export default function ThreadMessage({ message }: ThreadMessageProps) {
    const { date, time } = formatDate(message.createdAt)

    return (
        <div className='message'>
            <div className='header'>
                <span className='username'>{message.author.username}</span>
                <span className='date'>{`${date} в ${time}`}</span>
            </div>
            <div className='text'>{message.text}</div>
            {message.children.map(childMessage => <ThreadMessage key={childMessage.id} message={childMessage} />)}
        </div>
    )
}
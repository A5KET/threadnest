import { MoveDown, MoveUp } from 'lucide-react'

export interface MessageRatingProps {
    rating: number
}


export default function MessageRating({ rating }: MessageRatingProps) {
    return (
        <div className='message-rating' >
            <MoveUp className='like' />
            <div className='rating'>{rating}</div>
            <MoveDown className='dislike' />
        </div>
    )
}
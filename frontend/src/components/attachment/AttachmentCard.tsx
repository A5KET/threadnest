import AttachmentIcon from './AttachmentIcon'
import { X } from 'lucide-react'

import '../../styles/attachments.css'

export interface AttachmentCardProps {
    name: string
    mimetype: string
    onClick?: () => void
    onRemove?: () => void
}



export default function AttachmentCard({ name, mimetype, onClick, onRemove }: AttachmentCardProps) {
    return (
        <div className='attachment' onClick={onClick}>
            <AttachmentIcon className='icon' mimetype={mimetype} />
            <div className='name'>{name}</div>
            {onRemove
                ? <X onClick={onRemove} className='remove-button' />
                : null
            }
        </div>
    )
}
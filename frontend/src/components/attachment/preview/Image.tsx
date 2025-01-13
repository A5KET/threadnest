import { Attachment } from 'common/types'
import { getFullStaticPath } from '../../../utils'

export interface ImageAttachmentPreviewProps {
    attachment: Attachment
}


export default function ImageAttachmentPreview({ attachment }: ImageAttachmentPreviewProps) {
    return (
        <div className='preview-image'>
            <img src={getFullStaticPath(attachment.path)} />
        </div>
    )
}
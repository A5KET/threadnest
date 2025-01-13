import { AttachmentType, getAttachmentTypeFromMime } from 'common/attachments'
import { Attachment } from 'common/types'
import ImageAttachmentPreview from './Image'
import TextAttachmentPreview from './Text'


export interface AttachmentPreviewProps {
    attachment: Attachment
    attachmentType: AttachmentType
}



export default function AttachmentPreview({ attachment, attachmentType }: AttachmentPreviewProps) {
    switch(attachmentType) {
        case 'image':
            return <ImageAttachmentPreview attachment={attachment} />
        case 'text':
            return <TextAttachmentPreview />
        default:
            return <></>
    }
}
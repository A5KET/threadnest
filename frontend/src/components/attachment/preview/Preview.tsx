import { AttachmentType } from 'common/attachments'
import { Attachment } from 'common/types'
import ImageAttachmentPreview from './Image'
import TextAttachmentPreview from './Text'
import useStaticContext from '../../../hooks/useStaticContext'


export interface AttachmentPreviewProps {
    attachment: Attachment
    attachmentType: AttachmentType
}



export default function AttachmentPreview({ attachment, attachmentType }: AttachmentPreviewProps) {
    const { getStaticPath } = useStaticContext()

    switch(attachmentType) {
        case 'image':
            return <ImageAttachmentPreview path={getStaticPath(attachment.path)} />
        case 'text':
            return <TextAttachmentPreview />
        default:
            return <></>
    }
}
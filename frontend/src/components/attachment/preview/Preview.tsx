import { AttachmentType } from 'common/attachments'
import { Attachment } from 'common/types'
import { useEffect, useState } from 'react'
import useStaticContext from '../../../hooks/useStaticContext'
import ImageAttachmentPreview from './Image'
import TextAttachmentPreview from './Text'


export interface AttachmentPreviewProps {
    attachment: Attachment
    attachmentType: AttachmentType
}



export default function AttachmentPreview({ attachment, attachmentType }: AttachmentPreviewProps) {
    const [textContent, setTextContent] = useState<string | null>(null)
    const { getStaticURL, fetchStaticTextContent } = useStaticContext()

    useEffect(() => {
        if (attachmentType === 'text') {
            fetchStaticTextContent(attachment.path).then(setTextContent)
        } else {
            setTextContent(null)
        }
    }, [attachment])

    switch (attachmentType) {
        case 'image':
            return <ImageAttachmentPreview path={getStaticURL(attachment.path)} />
        case 'text':
            return (textContent ? <TextAttachmentPreview text={textContent} /> : null)
        default:
            return <></>
    }
}
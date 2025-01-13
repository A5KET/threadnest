import { AttachmentType, getAttachmentTypeFromMime } from 'common/attachments'
import { Attachment } from 'common/types'
import { useState } from 'react'

export default function useAttachmentPreview() {
    const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null)
    const [attachmentType, setAttachmentType] = useState<AttachmentType>('default')
    const onAttachmentClick = (attachment: Attachment) => {
        const newAttachmentType = getAttachmentTypeFromMime(attachment.mimetype)

        if (newAttachmentType !== 'default') {
            setPreviewAttachment(attachment)
            setAttachmentType(newAttachmentType)
        }
    }

    const onPreviewClose = () => {
        setPreviewAttachment(null)
        setAttachmentType('default')
    }

    return {
        previewAttachment,
        attachmentType,
        onAttachmentClick,
        onPreviewClose
    }
}
import { Attachment } from 'common/types'
import Lightbox from './Lightbox'

import { X } from 'lucide-react'
import '../../../styles/preview.css'
import { AttachmentType } from 'common/attachments'
import AttachmentPreview from './Preview'


export interface AttachmentPreviewViewerProps {
    attachment: Attachment
    attachmentType: AttachmentType
    onPreviewClose: () => void
}


export default function AttachmentPreviewViewer({ attachment, attachmentType, onPreviewClose }: AttachmentPreviewViewerProps) {


    return (
        <Lightbox onClose={onPreviewClose}>
            <AttachmentPreview attachment={attachment} attachmentType={attachmentType} />
            <div className='preview-footer'>
                <div className='preview-metadata'>
                    <div className='name'>{attachment.name}</div>
                    <div className='date'>{attachment.createdAt.toLocaleString('en-GB', { minute: '2-digit', second: '2-digit' })}</div>
                </div>
                <X className='close-button' size={40} onClick={onPreviewClose} />
            </div>
        </Lightbox>
    )
}
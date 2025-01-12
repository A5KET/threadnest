import AttachmentCard from '../attachment/AttachmentCard'
import '../../styles/attachments.css'


export interface FormAttachmentsProps {
    attachmentFiles: File[]
    onAttachmentRemove: (attachment: File) => void
}

export default function FormAttachments({ attachmentFiles: attachments, onAttachmentRemove }: FormAttachmentsProps) {
    return (
        <div className='attachments'>
            {
                attachments.map(
                    (attachmentFile, index) =>
                        <AttachmentCard
                            key={index}
                            name={attachmentFile.name}
                            mimetype={attachmentFile.type}
                            onClick={() => { }}
                            onRemove={(() => onAttachmentRemove(attachmentFile))}
                        />)
            }
        </div>
    )
}
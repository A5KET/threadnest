export interface TextAttachmentPreviewProps {
    text: string
}


export default function TextAttachmentPreview({ text }: TextAttachmentPreviewProps) {
    return (
        <div className='preview-text'>
            {text}
        </div>
    )
}
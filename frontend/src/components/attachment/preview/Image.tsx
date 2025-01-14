export interface ImageAttachmentPreviewProps {
    path: string
}


export default function ImageAttachmentPreview({ path }: ImageAttachmentPreviewProps) {
    return (
        <div className='preview-image'>
            <img src={path} />
        </div>
    )
}
import { getFileTypeFromMime } from 'common/attachments'
import { File, FileImage, FileText, LucideProps } from 'lucide-react'


export interface AttachmentIconProps extends LucideProps {
    mimetype: string
}


function useAttachmentIcon(mimetype: string) {
    switch (getFileTypeFromMime(mimetype)) {
        case 'image':
            return FileImage
        case 'text':
            return FileText
        default:
            return File
    }
}


export default function AttachmentIcon(props: AttachmentIconProps) {
    const Icon = useAttachmentIcon(props.mimetype)

    return <Icon {...props} />
}

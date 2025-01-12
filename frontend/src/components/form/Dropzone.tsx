
import useAttachmentDropzone from '../../hooks/useAttachmentDropzone'


export interface MessageFormDropzoneProps {
    onDrop: (files: File[]) => void
    onError: (error: string) => void
}


export default function FormDropzone({ onDrop, onError }: MessageFormDropzoneProps) {
    const { isDragActive, getRootProps, getInputProps } = useAttachmentDropzone(onDrop, onError)

    return (
        <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
    )
}
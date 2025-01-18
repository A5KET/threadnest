import { getAttachmentTypeFromMime } from 'common/attachments'
import { maxAttachmentImageHeight, maxAttachmentImageWidth, maxAttachmentSize, maxTextAttachmentSize, mimeToAcceptedAttachmentFileExtension } from 'common/constraints'
import { ErrorCode, FileRejection, useDropzone } from 'react-dropzone'


function validateAttachmentFile(file: File) {
    return new Promise((resolve, reject) => {
        const attachmentType = getAttachmentTypeFromMime(file.type)

        if (attachmentType === 'text') {
            if (file.size > maxTextAttachmentSize) {
                reject(new Error('File is too large'))
            }

            resolve(undefined)
            return
        }

        const reader = new FileReader()

        reader.onload = () => {
            if (!reader.result) {
                reject(new Error('Failed to load file'))
                return
            }

            if (attachmentType === 'image') {
                const img = new Image()

                img.onload = () => {
                    if (img.width > maxAttachmentImageWidth || img.height > maxAttachmentImageHeight) {
                        reject(new Error(`Image attachment dimensions must be ${maxAttachmentImageWidth}x${maxAttachmentImageHeight} or smaller.`))
                        return
                    }

                    resolve(undefined)
                }

                img.onerror = () => {
                    reject(new Error('Failed to load image'))
                }

                img.src = reader.result as string
            }
        }

        reader.onerror = () => {
            console.error(reader.error)
            reject(new Error('Failed to load file'))
        }

        reader.readAsDataURL(file)
    })
}


export default function useAttachmentDropzone(onDrop: (files: File[]) => void, onError: (error: string) => void) {
    const handleDrop = (files: File[], rejections: FileRejection[]) => {
        console.log(files, rejections)
        if (rejections.length > 0) {
            const error = rejections[0].errors[0]

            let message

            switch (error.code) {
                case ErrorCode.FileInvalidType:
                    message = 'Invalid file type. Allowed: jpg, png or txt.'
                    break
                case ErrorCode.FileTooLarge:
                    message = 'File is too large'
                    break
                default:
                    message = 'File uploading error'
            }

            onError(message)
        }

        if (files.length < 1) {
            return
        }

        Promise
            .all(files.map(file => validateAttachmentFile(file)))
            .then(() => onDrop(files))
            .catch(error => onError(error.message))

    }

    return useDropzone({
        accept: mimeToAcceptedAttachmentFileExtension,
        onDrop: handleDrop,
        maxSize: maxAttachmentSize
    })
}
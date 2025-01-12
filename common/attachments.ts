export type AttachmentType = 'image' | 'text' | 'default'

type FileMetadata = {
    extensions: string[]
    type: AttachmentType
}

export const mimeTypeToAttachmentMetadata: Record<string, FileMetadata | undefined> = {
    'image/jpeg': { extensions: ['.jpg', '.jpeg'], type: 'image' },
    'image/png': { extensions: ['.png'], type: 'image' },
    'text/plain': { extensions: ['.txt'], type: 'text' }
} as const

export const allowedAttachmentFileExtensions = Object.values(mimeTypeToAttachmentMetadata).map(metadata => metadata!.extensions).flat()
export const allowedAttachmentFileMimeTypes = Object.keys(mimeTypeToAttachmentMetadata)

export function getFileTypeFromMime(mimetype: string): AttachmentType {
    return mimeTypeToAttachmentMetadata[mimetype as keyof typeof mimeTypeToAttachmentMetadata]?.type || 'default'
}
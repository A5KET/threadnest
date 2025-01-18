import { mimeTypeToAttachmentMetadata } from './attachments'

export const maxAttachmentImageHeight = 240
export const maxAttachmentImageWidth = 320
export const maxTextAttachmentSize = 100 * 1024
export const maxAttachmentSize = 1 * 1024 * 1024

export const mimeToAcceptedAttachmentFileExtension = Object
    .keys(mimeTypeToAttachmentMetadata)
    .reduce<Record<string, readonly string[]>>((object, mimeType) => {
        object[mimeType] = mimeTypeToAttachmentMetadata[mimeType as keyof typeof mimeTypeToAttachmentMetadata]!.extensions

        return object
    }, {})
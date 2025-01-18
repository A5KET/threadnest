import { getAttachmentTypeFromMime } from 'common/attachments'
import { maxAttachmentImageHeight, maxAttachmentImageWidth, maxTextAttachmentSize } from 'common/constraints'
import sharp from 'sharp'
import { z } from 'zod'

export const authorSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    homepage: z.string().url().optional()
})

export const messageSchema = z.object({
    text: z.string(),
    parentId: z.number().optional(),
    author: authorSchema
})

export const attachmentSchema = z
    .custom<Express.Multer.File>()
    .superRefine(async (attachment, ctx) => {
        const attachmentType = getAttachmentTypeFromMime(attachment.mimetype)

        if (attachmentType === 'text') {
            if (attachment.size > maxTextAttachmentSize) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `TXT file must be less than or equal to ${maxTextAttachmentSize}`,
                    path: ['buffer'],
                })
            }
        } else if (attachmentType === 'image') {
            try {
                const metadata = await sharp(attachment.buffer).metadata()

                if (metadata.width! > maxAttachmentImageWidth || metadata.height! > maxAttachmentImageHeight) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Image attachment dimensions must be ${maxAttachmentImageWidth}x${maxAttachmentImageHeight} or smaller`,
                        path: ['buffer'],
                    })
                }
            } catch (error) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Failed to process image for dimension validation',
                    path: ['buffer'],
                })
            }
        } else {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Unexpected attachment type',
                path: ['buffer'],
            })
        }
    })

export const attachmentsSchema = z.array(attachmentSchema)

export const newMessageSchema = z.object({
    message: messageSchema,
})
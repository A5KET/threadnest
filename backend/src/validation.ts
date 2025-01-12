import { maxAttachmentImageHeight, maxAttachmentImageWidth, maxAttachmentTextSize } from 'common/constraints'
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
    .refine((attachment) => {
        if (attachment.mimetype === 'text/plain') {
            return attachment.size <= maxAttachmentTextSize
        }

        return true
    }, 'TXT file must be less than or equal to 100 KB.')
    .superRefine(async (attachment, ctx) => {
        try {
            const metadata = await sharp(attachment.buffer).metadata()

            if (metadata.width! > maxAttachmentImageWidth || metadata.height! > maxAttachmentImageHeight) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Image attachment dimensions must be ${maxAttachmentImageWidth}x${maxAttachmentImageHeight} or smaller.`,
                    path: ['buffer'],
                })
            }
        } catch (error) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Failed to process image for dimension validation.',
                path: ['buffer'],
            })
        }
    })

export const attachmentsSchema = z.array(attachmentSchema)

export const newMessageSchema = z.object({
    message: messageSchema,
})
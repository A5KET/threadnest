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

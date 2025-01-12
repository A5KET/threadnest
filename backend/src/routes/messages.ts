import { Request, Response, Router } from 'express'

import { Message, MessageDto, NewAttachment } from 'common/types'
import { checkMessageExists, createMessageWithAuthor, fetchHeadlineMessages, fetchMessageById, fetchMessagesByParentId, MessageOrderBy } from '../data'
import { parseBodyFields, validateBody, validateFiles } from '../middleware'
import { StaticService, Upload } from '../types'
import { attachmentsSchema, newMessageSchema } from '../validation'
import { ResponseBody } from './types'


export default function getMessagesRoutes(attachmentUpload: Upload, staticService: StaticService) {
    const MESSAGES_DEPTH = 3
    const defaultOrderBy: MessageOrderBy = { createdAt: 'desc' }

    const router = Router()

    router.get('/', async (req, res) => {
        const messages = await fetchHeadlineMessages(MESSAGES_DEPTH, defaultOrderBy)

        res.send({
            data: messages
        })
    })

    router.get('/:messageId', async (req, res) => {
        const messageId = Number(req.params.messageId)

        if (isNaN(messageId)) {
            res.status(400).json({ error: 'Invalid messageId, must be a number ' })
            return
        }

        const message = await fetchMessageById(messageId, MESSAGES_DEPTH, defaultOrderBy)

        if (!message) {
            res.status(404).send({
                message: 'Message not found',
                error: 'The specified parent entity does not exist'
            })

            return
        }

        res.send({
            data: message
        })
    })

    router.post(
        '/',
        attachmentUpload.any(),
        parseBodyFields(['message']),
        validateBody(newMessageSchema),
        validateFiles(attachmentsSchema),
        async (req: Request<{}, ResponseBody<Message>, { message: MessageDto }>, res: Response) => {
            let newMessage = req.body.message
            let parentId = undefined

            if (newMessage.parentId !== undefined) {
                const isParentExists = await checkMessageExists(newMessage.parentId)

                if (!isParentExists) {
                    res.status(404).send({
                        message: 'Parent message not found',
                        error: 'The specified parent entity does not exist'
                    })

                    return
                }

                parentId = newMessage.parentId
            }

            let attachments: NewAttachment[] | undefined = undefined

            if (Array.isArray(req.files)) {
                attachments = await Promise.all(req.files.map(file => staticService.saveFile(file)))
            }

            const message = await createMessageWithAuthor({
                parent: {},
                text: newMessage.text,
            }, newMessage.author, attachments)


            res.send({
                data: message,
            })
        }
    )

    router.get('/:messageId/children', async (req, res) => {
        const messageId = Number(req.params.messageId)

        if (isNaN(messageId)) {
            res.status(400).json({ error: 'Invalid messageId, must be a number ' })
            return
        }

        const messages = await fetchMessagesByParentId(messageId, MESSAGES_DEPTH, defaultOrderBy)

        res.send({ data: messages })
    })

    return router
}

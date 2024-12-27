import { Request, Response, Router } from 'express'

import { Message, NewMessage } from 'common'
import { checkMessageExists, createMessageWithAuthor, fetchHeadlineMessages, fetchMessagesByParentId } from '../data'
import { validateBody } from '../middleware'
import { messageSchema } from '../validation'

const MESSAGES_DEPTH = 3

const router = Router()


interface ResponseBody<B = any> {
    message?: string
    error?: any
    data?: B
}



router.get('/', async (req, res) => {
    const messages = await fetchHeadlineMessages(MESSAGES_DEPTH)

    res.send({
        data: messages
    })
})

router.post('/', validateBody(messageSchema), async (req: Request<{}, ResponseBody<Message>, NewMessage>, res: Response) => {
    const message = await createMessageWithAuthor(req.body)

    res.send({
        data: message
    })
})

router.get('/:messageId/children', async (req: Request<{ messageId: string }, ResponseBody<Message[]>>, res) => {
    const messageId = Number(req.params.messageId)
    
    const messages = await fetchMessagesByParentId(messageId, MESSAGES_DEPTH)

    res.send({ data: messages })
})

router.post('/:messageId/children', validateBody(messageSchema), async (req: Request<{ messageId: string }, ResponseBody<Message>, NewMessage>, res: Response) => {
    const messageId = Number(req.params.messageId)
    const isParentExists = await checkMessageExists(messageId)

    if (!isParentExists) {
        res.status(404).send({
            message: 'Parent message not found',
            error: 'The specified parent entity does not exist'
        })

        return
    }
    
    const message = await createMessageWithAuthor({
        ...req.body,
        parentId: messageId
    })

    res.send({
        data: message
    })
})


export default router
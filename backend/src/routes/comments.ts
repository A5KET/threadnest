import { Request, Response, Router } from 'express'

import { Comment, CommentDto, NewAttachment } from 'common/types'
import { checkCommentExists, createCommentWithAuthor, fetchHeadlineComments, fetchCommentById, fetchCommentsByParentId, CommentOrderBy } from '../data'
import { parseBodyFields, validateBody, validateFiles } from '../middleware'
import { StaticService, Upload } from '../types'
import { attachmentsSchema, newCommentSchema } from '../validation'
import { ResponseBody } from './types'


export default function getCommentsRoutes(attachmentUpload: Upload, staticService: StaticService) {
    const COMMENTS_DEPTH = 3
    const defaultOrderBy: CommentOrderBy = { createdAt: 'desc' }

    const router = Router()

    router.get('/', async (req, res) => {
        const comments = await fetchHeadlineComments(COMMENTS_DEPTH, defaultOrderBy)

        res.send({
            data: comments
        })
    })

    router.get('/:commentId', async (req, res) => {
        const commentId = Number(req.params.commentId)

        if (isNaN(commentId)) {
            res.status(400).json({ error: 'Invalid commentId, must be a number ' })
            return
        }

        const comment = await fetchCommentById(commentId, COMMENTS_DEPTH, defaultOrderBy)

        if (!comment) {
            res.status(404).send({
                message: 'Comment not found',
                error: 'The specified parent entity does not exist'
            })

            return
        }

        res.send({
            data: comment
        })
    })

    router.post(
        '/',
        attachmentUpload.any(),
        parseBodyFields(['comment']),
        validateBody(newCommentSchema),
        validateFiles(attachmentsSchema),
        async (req: Request<{}, ResponseBody<Comment>, { comment: CommentDto }>, res: Response) => {
            let newComment = req.body.comment
            let parentId = undefined

            if (newComment.parentId !== undefined) {
                const isParentExists = await checkCommentExists(newComment.parentId)

                if (!isParentExists) {
                    res.status(404).send({
                        message: 'Parent comment not found',
                        error: 'The specified parent entity does not exist'
                    })

                    return
                }

                parentId = newComment.parentId
            }

            let attachments: NewAttachment[] | undefined = undefined

            if (Array.isArray(req.files)) {
                attachments = await Promise.all(req.files.map(file => staticService.saveFile(file)))
            }

            const comment = await createCommentWithAuthor({
                parent: {},
                text: newComment.text,
            }, newComment.author, attachments)


            res.send({
                data: comment,
            })
        }
    )

    router.get('/:commentId/children', async (req, res) => {
        const commentId = Number(req.params.commentId)

        if (isNaN(commentId)) {
            res.status(400).json({ error: 'Invalid commentId, must be a number ' })
            return
        }

        const comments = await fetchCommentsByParentId(commentId, COMMENTS_DEPTH, defaultOrderBy)

        res.send({ data: comments })
    })

    return router
}

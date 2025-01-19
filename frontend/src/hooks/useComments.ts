import { useCallback, useEffect, useState } from 'react'

import { Comment, CommentService, NewComment } from '../types'
import useErrorContext from './useErrorContext'


export default function useComments(commentService: CommentService) {
    const [rootComments, setRootComments] = useState<Comment[]>([])
    const [rootCommentLookup, setRootCommentLookup] = useState<Record<number, number>>({})
    const { setError } = useErrorContext()

    useEffect(() => {
        commentService.getComments()
            .then(setRootComments)
            .catch(error => {
                console.error(error)
                setError('Connection error')
            })
    }, [])

    useEffect(() => {
        const lookupIds: Record<number, number> = {}

        const lookup = (parentId: number, child: Comment) => {
            lookupIds[child.id] = parentId

            child.children?.forEach(cur => lookup(parentId, cur))
        }

        for (const topComment of rootComments) {
            const topCommentId = topComment.id

            lookupIds[topCommentId] = topCommentId
            topComment.children?.forEach(cur => lookup(topCommentId, cur))
        }

        setRootCommentLookup(lookupIds)
    }, [rootComments])

    const updateCommentTree = (rootComment: Comment, updatedComment: Comment): Comment => {
        if (rootComment.id === updatedComment.id) {
            return updatedComment
        }

        const updatedChildren = rootComment.children ? rootComment.children.map(child => updateCommentTree(child, updatedComment)) : undefined

        return {
            ...rootComment,
            children: updatedChildren
        }
    }

    const addHeadlineComment = useCallback(
        (newComment: NewComment) => {
            commentService.createComment(newComment).then(comment => setRootComments(prev => [comment, ...prev]))
        }, [commentService]
    )

    const addReplyComment = useCallback(
        (parentComment: Comment, replyComment: NewComment) => {
            commentService.createReplyComment(parentComment, replyComment).then(comment => {
                const newParentComment = {
                    ...parentComment,
                    children: parentComment.children ? [comment, ...parentComment.children] : [comment],
                    hasChildren: true
                }

                const rootCommentId = rootCommentLookup[parentComment.id]
                const rootComment = rootComments.find(cur => cur.id === rootCommentId)

                if (!rootComment) {
                    throw new Error(`Missing rootComment for ${parentComment.id}`)
                }

                const updatedRootComment = updateCommentTree(rootComment, newParentComment)

                setRootComments(prev => prev.map(cur => (cur.id === rootCommentId ? updatedRootComment : cur)))
            })
        }, [commentService, rootCommentLookup, rootComments]
    )

    return {
        comments: rootComments,
        addHeadlineComment,
        addReplyComment
    }
}
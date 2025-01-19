import { Attachment, Author, Comment, Prisma, PrismaClient } from '@prisma/client'
import { NewAttachment } from 'common/types'

const prisma = new PrismaClient()

export type CommentOrderBy = Prisma.CommentOrderByWithRelationInput

type CommentWithChildren = Comment & {
    author: Author,
    attachments: Attachment[]
    children?: CommentWithChildren[]
    hasChildren: boolean
}

type RecursiveCommentInclude = {
    include: {
        author: true
        children: RecursiveCommentInclude | {
            select: {
                id: true
            }
        },
        attachments: true
    }
    orderBy: CommentOrderBy
}


function createRecursiveCommentInclude(depth: number, orderBy: CommentOrderBy) {
    let includeObject: RecursiveCommentInclude = {
        include: {
            author: true,
            children: {
                select: {
                    id: true,
                }
            },
            attachments: true
        },
        orderBy
    }

    for (let i = 0; i < depth; i++) {
        includeObject = {
            include: {
                author: true,
                children: includeObject,
                attachments: true
            },
            orderBy
        }
    }

    return includeObject.include
}

const memoizedCreateRecursiveCommentInclude = (() => {
    const memoized: Record<number, Readonly<ReturnType<typeof createRecursiveCommentInclude>> | undefined> = {}

    return function (depth: number, orderBy: CommentOrderBy) {
        const memoizedResult = memoized[depth]

        if (!memoizedResult) {
            const result = createRecursiveCommentInclude(depth, orderBy)

            memoized[depth] = Object.freeze(result)

            return result
        }

        return memoizedResult
    }
})()

function setHasChildrenAndCleanUp(comments: CommentWithChildren[], depth: number, maxDepth: number) {
    return comments.map((comment) => {
        const hasChildren = comment.children !== undefined && comment.children.length > 0
        comment.hasChildren = hasChildren

        if (depth >= maxDepth) {
            delete comment.children
        }
        else {
            comment.children = setHasChildrenAndCleanUp(comment.children!, depth + 1, maxDepth)
        }

        return comment
    })
}


export async function fetchCommentsByParentId(parentId: number | null, maxDepth: number, orderBy: CommentOrderBy) {
    let includeObject = memoizedCreateRecursiveCommentInclude(maxDepth, orderBy)

    const comments = await prisma.comment.findMany({
        where: {
            parentId
        },
        include: includeObject,
        orderBy
    })

    return setHasChildrenAndCleanUp(comments as CommentWithChildren[], 1, maxDepth)
}

export async function fetchCommentById(commentId: number, maxDepth: number, orderBy: CommentOrderBy) {
    let includeObject = memoizedCreateRecursiveCommentInclude(maxDepth, orderBy)

    const comment = await prisma.comment.findUnique({
        where: {
            id: commentId
        },
        include: includeObject
    })

    if (comment === null) {
        return null
    }


    const result = setHasChildrenAndCleanUp([comment as CommentWithChildren], 0, maxDepth)

    return result[0]
}

export async function fetchHeadlineComments(maxDepth: number, orderBy: CommentOrderBy) {
    return fetchCommentsByParentId(null, maxDepth, orderBy)
}

export async function createComment(comment: Prisma.CommentUncheckedCreateInput) {
    const res = await prisma.comment.create({
        data: comment,
        include: {
            author: true
        }
    })

    return {
        ...res,
        hasChildren: false
    }
}

export async function checkCommentExists(commentId: number) {
    return Boolean(await prisma.comment.findUnique({
        where: {
            id: commentId
        }
    }))
}

export async function createCommentWithAuthor(
    comment: Prisma.CommentCreateWithoutAuthorInput,
    author: Prisma.AuthorCreateInput,
    attachments: NewAttachment[] = []
) {
    const createdComment = await prisma.comment.create({
        data: {
            text: comment.text,
            author: {
                create: author
            },
            attachments: {
                create: attachments
            }
        },
        include: {
            author: true,
            attachments: true
        }
    })

    return {
        ...createdComment,
        hasChildren: false
    }
}

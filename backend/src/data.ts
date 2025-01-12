import { Attachment, Author, Message, Prisma, PrismaClient } from '@prisma/client'
import { NewAttachment } from 'common/types'

const prisma = new PrismaClient()

export type MessageOrderBy = Prisma.MessageOrderByWithRelationInput

type MessageWithChildren = Message & {
    author: Author,
    attachments: Attachment[]
    children?: MessageWithChildren[]
    hasChildren: boolean
}

type RecursiveMessageInclude = {
    include: {
        author: true
        children: RecursiveMessageInclude | {
            select: {
                id: true
            }
        },
        attachments: true
    }
    orderBy: MessageOrderBy
}


function createRecursiveMessageInclude(depth: number, orderBy: MessageOrderBy) {
    let includeObject: RecursiveMessageInclude = {
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

const memoizedCreateRecursiveMessageInclude = (() => {
    const memoized: Record<number, Readonly<ReturnType<typeof createRecursiveMessageInclude>> | undefined> = {}

    return function (depth: number, orderBy: MessageOrderBy) {
        const memoizedResult = memoized[depth]

        if (!memoizedResult) {
            const result = createRecursiveMessageInclude(depth, orderBy)

            memoized[depth] = Object.freeze(result)

            return result
        }

        return memoizedResult
    }
})()

function setHasChildrenAndCleanUp(messages: MessageWithChildren[], depth: number, maxDepth: number) {
    return messages.map((message) => {
        const hasChildren = message.children !== undefined && message.children.length > 0
        message.hasChildren = hasChildren

        if (depth >= maxDepth) {
            delete message.children
        }
        else {
            message.children = setHasChildrenAndCleanUp(message.children!, depth + 1, maxDepth)
        }

        return message
    })
}


export async function fetchMessagesByParentId(parentId: number | null, maxDepth: number, orderBy: MessageOrderBy) {
    let includeObject = memoizedCreateRecursiveMessageInclude(maxDepth, orderBy)

    const messages = await prisma.message.findMany({
        where: {
            parentId
        },
        include: includeObject,
        orderBy
    })

    return setHasChildrenAndCleanUp(messages as MessageWithChildren[], 1, maxDepth)
}

export async function fetchMessageById(messageId: number, maxDepth: number, orderBy: MessageOrderBy) {
    let includeObject = memoizedCreateRecursiveMessageInclude(maxDepth, orderBy)

    const message = await prisma.message.findUnique({
        where: {
            id: messageId
        },
        include: includeObject
    })

    if (message === null) {
        return null
    }


    const result = setHasChildrenAndCleanUp([message as MessageWithChildren], 0, maxDepth)

    return result[0]
}

export async function fetchHeadlineMessages(maxDepth: number, orderBy: MessageOrderBy) {
    return fetchMessagesByParentId(null, maxDepth, orderBy)
}

export async function createMessage(message: Prisma.MessageUncheckedCreateInput) {
    const res = await prisma.message.create({
        data: message,
        include: {
            author: true
        }
    })

    return {
        ...res,
        hasChildren: false
    }
}

export async function checkMessageExists(messageId: number) {
    return Boolean(await prisma.message.findUnique({
        where: {
            id: messageId
        }
    }))
}

export async function createMessageWithAuthor(
    message: Prisma.MessageCreateWithoutAuthorInput,
    author: Prisma.AuthorCreateInput,
    attachments: NewAttachment[] = []
) {
    const createdMessage = await prisma.message.create({
        data: {
            text: message.text,
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
        ...createdMessage,
        hasChildren: false
    }
}

import { Author, Message as MessageModel, Prisma, PrismaClient } from '@prisma/client'
import { NewAuthor } from 'common'

const prisma = new PrismaClient()

type MessageWithChildren = MessageModel & {
    author: Author,
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
        }
    }
}


function createRecursiveMessageInclude(depth: number) {
    let includeObject: RecursiveMessageInclude = {
        include: {
            author: true,
            children: {
                select: {
                    id: true,
                },
            },
        }
    }

    for (let i = 0; i < depth - 1; i++) {
        includeObject = {
            include: {
                author: true,
                children: includeObject
            },
        }
    }

    return includeObject.include
}

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


export async function fetchMessagesByParentId(parentId: number | null, maxDepth: number) {
    let includeObject = createRecursiveMessageInclude(maxDepth)

    const messages = await prisma.message.findMany({
        where: {
            parentId
        },
        include: includeObject
    })

    return setHasChildrenAndCleanUp(messages as MessageWithChildren[], 0, maxDepth)
}

export async function fetchMessageById(messageId: number, maxDepth: number) {
    let includeObject = createRecursiveMessageInclude(maxDepth)

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

export async function fetchHeadlineMessages(maxDepth: number) {
    return fetchMessagesByParentId(null, maxDepth)
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
        children: [],
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

export async function createAuthor(author: Prisma.AuthorUncheckedCreateInput) {
    return prisma.author.create({
        data: author
    })
}


export async function createMessageWithAuthor(message: Omit<Prisma.MessageUncheckedCreateInput, 'authorId'> & { author: NewAuthor}) {
    console.log(message)
    const author = await createAuthor(message.author)
    return await createMessage({
        authorId: author.id,
        text: message.text,
        createdAt: new Date()
    })
}
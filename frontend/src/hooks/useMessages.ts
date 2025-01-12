import { useCallback, useEffect, useState } from 'react'

import { Message, MessageService, NewMessage } from '../types'
import useErrorContext from './useErrorContext'


export function useMessages(messageService: MessageService) {
    const [rootMessages, setRootMessages] = useState<Message[]>([])
    const [rootMessageLookup, setRootMessageLookup] = useState<Record<number, number>>({})
    const { setError } = useErrorContext()

    useEffect(() => {
        messageService.getMessages()
            .then(setRootMessages)
            .catch(error => {
                console.error(error)
                setError('Connection error')
            })
    }, [])

    useEffect(() => {
        const lookupIds: Record<number, number> = {}

        const lookup = (parentId: number, child: Message) => {
            lookupIds[child.id] = parentId

            child.children?.forEach(cur => lookup(parentId, cur))
        }

        for (const topMessage of rootMessages) {
            const topMessageId = topMessage.id

            lookupIds[topMessageId] = topMessageId
            topMessage.children?.forEach(cur => lookup(topMessageId, cur))
        }

        setRootMessageLookup(lookupIds)
    }, [rootMessages])

    const updateMessageTree = (rootMessage: Message, updatedMessage: Message): Message => {
        if (rootMessage.id === updatedMessage.id) {
            return updatedMessage
        }

        const updatedChildren = rootMessage.children ? rootMessage.children.map(child => updateMessageTree(child, updatedMessage)) : undefined

        return {
            ...rootMessage,
            children: updatedChildren
        }
    }

    const addHeadlineMessage = useCallback(
        (newMessage: NewMessage) => {
            messageService.createMessage(newMessage).then(message => setRootMessages(prev => [message, ...prev]))
        }, [messageService]
    )

    const addReplyMessage = useCallback(
        (parentMessage: Message, replyMessage: NewMessage) => {
            messageService.createReplyMessage(parentMessage, replyMessage).then(message => {
                const newParentMessage = {
                    ...parentMessage,
                    children: parentMessage.children ? [message, ...parentMessage.children] : [message],
                    hasChildren: true
                }

                const rootMessageId = rootMessageLookup[parentMessage.id]
                const rootMessage = rootMessages.find(cur => cur.id === rootMessageId)

                if (!rootMessage) {
                    throw new Error(`Missing rootMessage for ${parentMessage.id}`)
                }

                const updatedRootMessage = updateMessageTree(rootMessage, newParentMessage)

                setRootMessages(prev => prev.map(cur => (cur.id === rootMessageId ? updatedRootMessage : cur)))
            })
        }, [messageService, rootMessageLookup, rootMessages]
    )

    return {
        messages: rootMessages,
        addHeadlineMessage,
        addReplyMessage
    }
}
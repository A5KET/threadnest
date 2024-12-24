import { useMemo } from 'react'
import { Message, MessageNode } from '../types'



export default function useMessageTree(messages: Message[]) {
    return useMemo(() => {
        const messageMap = new Map<number, MessageNode>()
        const roots: MessageNode[] = []

        for (const message of messages) {
            messageMap.set(message.id, { ...message, children: [] })
        }

        for (const message of messages) {
            const node = messageMap.get(message.id)!

            if (message.parentId === null) {
                roots.push(node)
            }
            else {
                const parent = messageMap.get(message.parentId)

                if (parent) {
                    parent.children.push(node)
                }
            }
        }

        return roots
    }, [messages])
}
import { useMemo } from 'react'
import { Message, MessageNode } from '../types'


export default function useMessageTree(messages: Message[], compareFn: (a: Message, b: Message) => number) {
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

        const sortMessageTree = (nodes: MessageNode[]) => {
            nodes.sort(compareFn)

            nodes.forEach((node) => {
                if (node.children.length > 0) {
                    sortMessageTree(node.children)
                }
            })
        }

        sortMessageTree(roots)

        return roots
    }, [messages])
}

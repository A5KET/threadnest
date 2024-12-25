import { useEffect, useState } from 'react'
import useMessageTree from '../hooks/useMessageThree'
import { Message, MessageReaction, MessageService, NewMessage } from '../types'
import ThreadMessage from './Message'
import MessageForm from './MessageForm'

export interface AppProps {
  messageService: MessageService
}

function App({ messageService }: AppProps) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    messageService.getMessages().then(setMessages)
  }, [messageService])

  const handleNewMessage = (newMessage: NewMessage) => {
    messageService.createMessage(newMessage).then(message => {
      setMessages([message, ...messages])
    })
  }

  const handleMessageNewReaction = (message: Message, newReaction: MessageReaction) => {
    messageService.changeMessageReaction(message, newReaction).then(newMessage => {
      setMessages((prevMessages) =>
        prevMessages.map((cur) =>
          cur.id === message.id ? newMessage : cur
        )
      )
    })
  }

  const messageTreeRoots = useMessageTree(messages, (a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <>
      <header>
        Threadnest
      </header>
      <main>
        <MessageForm onSubmit={handleNewMessage} />
        {messageTreeRoots.map(message => <ThreadMessage key={message.id} message={message} onReaction={handleMessageNewReaction} />)}
      </main>
      <footer>

      </footer>
    </>
  )
}

export default App

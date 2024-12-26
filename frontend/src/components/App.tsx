import { useEffect, useState } from 'react'
import { Message, MessageService, NewMessage } from '../types'
import ThreadMessage from './Message'
import MessageForm, { MessageFormData } from './MessageForm'

export interface AppProps {
  messageService: MessageService
}

function App({ messageService }: AppProps) {
  const [messages, setMessages] = useState<Message[]>([])
  console.log(messages)

  useEffect(() => {
    messageService.getMessages().then(setMessages)
  }, [messageService])

  const handleNewMessage = (data: MessageFormData) => {
    const newMessage: NewMessage = {
      text: data.text,
      author: {
        username: data.username,
        email: data.email,
        homepage: data.homepage.length > 0 ? data.homepage : undefined
      }
    }

    messageService.createMessage(newMessage).then(message => {
      setMessages([message, ...messages])
    })
  }

  return (
    <>
      <header>
        Threadnest
      </header>
      <main>
        <MessageForm onSubmit={handleNewMessage} />
        {messages.map(message => <ThreadMessage key={message.id} message={message} />)}
      </main>
      <footer>

      </footer>
    </>
  )
}

export default App

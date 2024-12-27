import { useMessages } from '../hooks/useMessages'
import { MessageService } from '../types'
import { createMessageFromFormData } from '../utils'
import ThreadMessage from './Message'
import MessageForm, { MessageFormData } from './MessageForm'

export interface AppProps {
  messageService: MessageService
}

function App({ messageService }: AppProps) {
  const { messages, addHeadlineMessage, addReplyMessage } = useMessages(messageService)

  const handleNewMessage = (data: MessageFormData) => {
    const message = createMessageFromFormData(data)

    addHeadlineMessage(message)
  }

  return (
    <>
      <header>
        Threadnest
      </header>
      <main>
        <MessageForm onSubmit={handleNewMessage} />
        {messages.map(message => <ThreadMessage key={message.id} message={message} onReply={addReplyMessage} />)}
      </main>
      <footer>

      </footer>
    </>
  )
}

export default App

import useErrorContext from '../hooks/useErrorContext'
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
  const { error } = useErrorContext()

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
        {error ? <div className='app-error'>{error}</div> : null}
        <MessageForm onSubmit={handleNewMessage} />
        {messages.map(message => <ThreadMessage key={message.id} message={message} onReply={addReplyMessage} />)}
      </main>
      <footer>

      </footer>
    </>
  )
}

export default App

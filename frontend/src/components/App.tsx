import useAttachmentPreview from '../hooks/useAttachmentPreview'
import useErrorContext from '../hooks/useErrorContext'
import { useMessages } from '../hooks/useMessages'
import { MessageService } from '../types'
import { createMessageFromFormData } from '../utils'
import ThreadMessage from './Message'
import AttachmentPreviewViewer from './attachment/preview/PreviewViewer'
import MessageForm, { MessageFormData } from './form/Form'

export interface AppProps {
  messageService: MessageService
}

function App({ messageService }: AppProps) {
  const { messages, addHeadlineMessage, addReplyMessage } = useMessages(messageService)
  const { previewAttachment, attachmentType, onPreviewClose, onAttachmentClick } = useAttachmentPreview()
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
        {previewAttachment ? <AttachmentPreviewViewer attachment={previewAttachment} attachmentType={attachmentType} onPreviewClose={onPreviewClose} /> : null}
        {error ? <div className='app-error'>{error}</div> : null}
        <MessageForm onSubmit={handleNewMessage} />
        {messages.map(message => <ThreadMessage
          key={message.id}
          message={message}
          onReply={addReplyMessage}
          onAttachmentClick={onAttachmentClick}
        />)}
      </main>
      <footer>

      </footer>
    </>
  )
}

export default App

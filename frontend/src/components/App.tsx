import useAttachmentPreview from '../hooks/useAttachmentPreview'
import useErrorContext from '../hooks/useErrorContext'
import useComments from '../hooks/useComments'
import { CommentService } from '../types'
import { createCommentFromFormData } from '../utils'
import ThreadComment from './Comment'
import AttachmentPreviewViewer from './attachment/preview/PreviewViewer'
import CommentForm, { CommentFormData } from './form/Form'

export interface AppProps {
  commentService: CommentService
}

function App({ commentService }: AppProps) {
  const { comments, addHeadlineComment, addReplyComment } = useComments(commentService)
  const { previewAttachment, attachmentType, onPreviewClose, onAttachmentClick } = useAttachmentPreview()
  const { error } = useErrorContext()

  const handleNewComment = (data: CommentFormData) => {
    const comment = createCommentFromFormData(data)

    addHeadlineComment(comment)
  }

  return (
    <>
      <header>
        Threadnest
      </header>
      <main>
        {previewAttachment ? <AttachmentPreviewViewer attachment={previewAttachment} attachmentType={attachmentType} onPreviewClose={onPreviewClose} /> : null}
        {error ? <div className='app-error'>{error}</div> : null}
        <CommentForm onSubmit={handleNewComment} />
        {comments.map(comment => <ThreadComment
          key={comment.id}
          comment={comment}
          onReply={addReplyComment}
          onAttachmentClick={onAttachmentClick}
        />)}
      </main>
      <footer>

      </footer>
    </>
  )
}

export default App

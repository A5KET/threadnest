import { CommentFormData } from './components/form/Form'
import { NewComment } from './types'

export function formatDate(date: Date | string) {
    return {
        date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }),
        time: new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    }
}

export function createCommentFromFormData(data: CommentFormData): NewComment {
    return {
        text: data.text,
        author: {
            username: data.username,
            email: data.email,
            homepage: data.homepage.length > 0 ? data.homepage : undefined
        },
        attachments: data.attachments
    }
}

export function areFilesEqual(first: File, second: File) {
    return (
        first.name === second.name &&
        first.size === second.size &&
        first.lastModified === second.lastModified
    )
}

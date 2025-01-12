import { Paperclip } from 'lucide-react'
import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import FormAttachments from './Attachments'
import FormDropzone from './Dropzone'
import FormInput from './Input'
import FormTextArea from './TextArea'

import '../../styles/form.css'
import { areFilesEqual } from '../../utils'

export interface MessageFormFieldsData {
    username: string
    email: string
    homepage: string
    text: string
}

export interface MessageFormData extends MessageFormFieldsData {
    attachments: File[]
}

export interface MessageFormProps {
    onSubmit: (data: MessageFormData) => void
    onCancel?: () => void
}

export default function MessageForm({ onSubmit, onCancel = () => { } }: MessageFormProps) {
    const [error, setError] = useState<string | null>(null)
    const [isUploadingAttachment, setIsUploadingAttachment] = useState<boolean>(false)
    const [formData, setFormData] = useState<MessageFormFieldsData>({
        username: '',
        email: '',
        homepage: '',
        text: ''
    })
    const [attachments, setAttachments] = useState<File[]>([])
    const formRef = useRef<HTMLFormElement>(null)

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target

        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = () => {
        if (!formRef.current?.checkValidity()) {
            formRef.current?.reportValidity()
            return
        }

        onSubmit({ ...formData, attachments })

        const newFormData = Object
            .keys(formData)
            .reduce((data, key) => {
                data[key as keyof typeof data]

                return data
            }, { } as MessageFormFieldsData)

        setFormData(newFormData)
        setAttachments([])
        setIsUploadingAttachment(false)
        setError(null)
    }

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        handleSubmit()
    }

    const handleFormReset = () => {
        onCancel()
    }

    const handleAttachmentButtonClick = () => {
        setIsUploadingAttachment(!isUploadingAttachment)
    }

    const handleAttachmentUpload = (newAttachments: File[]) => {
        for (const newAttachment of newAttachments) {
            for (const attachment of attachments) {
                if (areFilesEqual(newAttachment, attachment)) {
                    setError(`${newAttachment.name} is already attached to the message`)

                    return
                }
            }
        }

        setAttachments([...attachments, ...newAttachments])
    }

    const handleAttachmentUploadError = (error: string) => {
        setError(error)
    }

    const handleAttachmentRemove = (removedAttachment: File) => {
        setAttachments(attachments => attachments.filter(attachment => attachment !== removedAttachment))
    }

    return (
        <form onSubmit={handleFormSubmit} className='message-form' ref={formRef}>
            <FormInput name='username' type='text' label='Username' value={formData['username']} onChange={handleChange} />
            <FormInput name='email' type='email' label='Email' value={formData['email']} onChange={handleChange} />
            <FormInput name='homepage' type='url' label='Home Page' value={formData['homepage']} onChange={handleChange} required={false} />
            <FormTextArea
                name='text'
                value={formData['text']}
                label='Text'
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
            {error ? <div className='error'>{error}</div> : null}
            {attachments.length > 0 ? <FormAttachments attachmentFiles={attachments} onAttachmentRemove={handleAttachmentRemove} /> : null}
            {isUploadingAttachment ? <FormDropzone onDrop={handleAttachmentUpload} onError={handleAttachmentUploadError} /> : null}
            <div className='bottom-bar'>
                <div className='tools'>
                    <button type='button'><Paperclip onClick={handleAttachmentButtonClick} /></button>
                </div>
                <div className='buttons'>
                    <button type='reset' onClick={handleFormReset}>Cancel</button>
                    <button type='submit'>Submit</button>
                </div>
            </div>
        </form>
    )
}
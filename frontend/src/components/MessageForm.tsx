import { ChangeEvent, FormEvent, KeyboardEvent, useRef, useState } from 'react'

import { NewMessage } from '../types'

export interface MessageFormProps {
    onSubmit: (data: MessageFormData) => void
}


interface FormElementProps {
    label: string
    name: string
    value: string
    minLength?: number
    required?: boolean
}

export interface MessageFormData {
    username: string
    email: string
    homepage: string
    text: string
}

interface FormInputProps extends FormElementProps {
    type: 'text' | 'email' | 'url'
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}


function FormInput({ type, label, name, value, minLength, required = true, onChange }: FormInputProps) {
    return (
        <div className={`message-form-field ${name}`}>
            <label className='invisible' htmlFor={name}>{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={label}
                minLength={minLength}
            />
        </div>
    )
}

interface FormTextAreaProps extends FormElementProps {
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
    onSubmit: () => void
}

function FormTextArea({ label, name, value, required = true, onChange, onSubmit }: FormTextAreaProps) {
    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()

            onSubmit()
        }
    }

    return (
        <div className='message-form-field text'>
            <label className='invisible' htmlFor={name}>{label}</label>
            <textarea
                id={name}
                name={name}
                value={value}
                placeholder={label}
                onKeyDown={handleKeyDown}
                onChange={onChange}
                required={required}
            />
        </div>
    )
}


export default function MessageForm({ onSubmit }: MessageFormProps) {
    const [formData, setFormData] = useState<Required<MessageFormData>>({
        username: '',
        email: '',
        homepage: '',
        text: ''
    })
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

        onSubmit(formData)

        for (const field in formData) {
            formData[field as keyof typeof formData] = ''
        }

    }

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        handleSubmit()
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
        </form>
    )
}
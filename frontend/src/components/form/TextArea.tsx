import { ChangeEvent, KeyboardEvent } from 'react'
import { FormElementProps } from './types'


interface FormTextAreaProps extends FormElementProps {
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
    onSubmit: () => void
}

export default function FormTextArea({ label, name, value, required = true, onChange, onSubmit }: FormTextAreaProps) {
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

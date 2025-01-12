import { ChangeEvent } from 'react'
import { FormElementProps } from './types'


interface FormInputProps extends FormElementProps {
    type: 'text' | 'email' | 'url'
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}


export default function FormInput({ type, label, name, value, minLength, required = true, onChange }: FormInputProps) {
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


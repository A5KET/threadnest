import { useContext } from 'react'
import { ErrorContext } from '../components/providers/Error'

export default function useErrorContext() {
    const context = useContext(ErrorContext)

    if (!context) {
        throw new Error("useErrorContext must be used within an ErrorProvider")
    }

    return context
}
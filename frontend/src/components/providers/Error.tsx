import { createContext, PropsWithChildren, useState } from 'react'

interface ErrorContextValue {
    error: string | null
    setError: (error: string) => void
}

export const ErrorContext = createContext<ErrorContextValue | null>(null)

export function ErrorProvider({ children }: PropsWithChildren) {
    const [error, setError] = useState<string | null>(null)

    return (
        <ErrorContext.Provider value={{ error, setError }}>
            {children}
        </ErrorContext.Provider>
    )
}

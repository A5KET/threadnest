import { useContext } from 'react'
import { StaticContext } from '../components/providers/Static'

export default function useStaticContext() {
    const context = useContext(StaticContext)

    if (!context) {
        throw new Error("useStaticContext must be used within an StaticProvider")
    }

    return context
}
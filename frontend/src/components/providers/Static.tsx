import { createContext, PropsWithChildren, useCallback } from 'react'

export interface StaticContextValue {
    staticRoot: string
    getStaticPath: (path: string) => string
}

export interface StaticProviderProps extends PropsWithChildren {
    staticRoot: string
}

export const StaticContext = createContext<StaticContextValue | null>(null)

export function StaticProvider({ children, staticRoot }: StaticProviderProps) {
    const getStaticPath = useCallback((path: string) => `${staticRoot}/${path}`, [staticRoot])

    return (
        <StaticContext.Provider value={{ staticRoot, getStaticPath }}>
            {children}
        </StaticContext.Provider>
    )
}
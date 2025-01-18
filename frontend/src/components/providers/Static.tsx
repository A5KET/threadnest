import { AxiosInstance } from 'axios'
import { createContext, PropsWithChildren, useCallback } from 'react'

export interface StaticContextValue {
    getStaticURL: (path: string) => string
    fetchStaticTextContent: (path: string) => Promise<string>
}

export interface StaticProviderProps extends PropsWithChildren {
    api: AxiosInstance
}

export const StaticContext = createContext<StaticContextValue | null>(null)

export function StaticProvider({ children, api }: StaticProviderProps) {
    const getStaticURL = useCallback((path: string) => api.getUri({ url: path }), [api])

    const fetchStaticTextContent = useCallback(async (path: string): Promise<string> => {
        return (await api(path, { responseType: 'text' })).data
    }, [api])

    return (
        <StaticContext.Provider value={{ getStaticURL, fetchStaticTextContent }}>
            {children}
        </StaticContext.Provider>
    )
}
import { createContext, useState } from "react"

import { useNavigate } from "react-router-dom"

type AppProviderProps = {
    children: React.ReactNode
    defaultIsLoggedIn?: boolean
    storageKey?: string
}

export type AppProviderState = {
    isLoggedIn: boolean
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    localLogout: () => void;
}

const initialState = {
    isLoggedIn: false,
    setIsLoggedIn: () => null,
    localLogout: () => null,
}

export const AppProviderContent = createContext<AppProviderState>(initialState)

export function AppProvider({
    children,
    defaultIsLoggedIn = localStorage.getItem("isLoggedIn") === "true",
    storageKey = "isLoggedIn",
    ...props
}: AppProviderProps) {


    const [isLoggedIn, setIsLoggedIn] = useState(
        () => localStorage.getItem(storageKey) === undefined ? false :
            typeof localStorage.getItem(storageKey) === 'string' ? localStorage.getItem(storageKey) === "true" : defaultIsLoggedIn
    )

    const localLogout = () => {
        setIsLoggedIn(false)
        localStorage.clear()
    }

    return (
        <AppProviderContent.Provider {...props} value={{
            localLogout,
            isLoggedIn: (isLoggedIn),
            setIsLoggedIn: (_isLoggedIn: boolean) => {
                if (!_isLoggedIn) {
                    localStorage.removeItem(storageKey)
                } else {
                    localStorage.setItem(storageKey, String(_isLoggedIn))
                }
                setIsLoggedIn(_isLoggedIn)
            },
        }}>
            {children}
        </AppProviderContent.Provider>
    )
}

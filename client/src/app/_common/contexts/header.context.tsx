// context/HeaderContext.tsx
'use client'
import { createContext, ReactNode, useContext, useState } from 'react'

interface HeaderContextProps {
  title: string
  subtitle: string
  setHeaderInfo: (title: string, subtitle: string) => void
}

const HeaderContext = createContext<HeaderContextProps | undefined>(undefined)

export function HeaderContextProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')

  const setHeaderInfo = (newTitle: string, newSubtitle: string = '') => {
    setTitle(newTitle)
    setSubtitle(newSubtitle)
  }

  return <HeaderContext.Provider value={{ title, subtitle, setHeaderInfo }}>{children}</HeaderContext.Provider>
}

export function useHeaderContext() {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error('useHeaderContext must be used within a HeaderContextProvider')
  }
  return context
}

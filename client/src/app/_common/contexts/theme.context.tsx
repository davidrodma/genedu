// context/HeaderContext.tsx
'use client'
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'

interface ThemeContextProps {
  theme: string
  setTheme: Dispatch<SetStateAction<string>>
}

export const ThemeContext = createContext<ThemeContextProps | null>(null)

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('')
  useEffect(() => {
    setTheme(
      localStorage?.getItem('theme') === '' ||
        (localStorage?.getItem('theme') && localStorage?.getItem('theme') !== null)
        ? (localStorage.getItem('theme') as string)
        : '',
    )
  }, [])
  useEffect(() => {
    if (localStorage.getItem('theme') !== '' && localStorage.getItem('theme') !== 'dark') {
      localStorage.setItem('theme', '')
    }
    const html = document?.querySelector('html')
    const strTheme = localStorage.getItem('theme') as string
    if (html && html != null && strTheme !== '') {
      html.classList.replace(strTheme, strTheme)
    }
  }, [])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider')
  }
  return context
}

import { ReactNode } from 'react'

export type Menu = {
  category?: string
  items: MenuItem[]
}

export type MenuItem = {
  title: string
  link?: string
  icon?: ReactNode
  badges?: ReactNode[]
  items?: MenuItem[]
}

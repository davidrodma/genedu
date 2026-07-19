'use client'
import { useEffect } from 'react'
import { useAuthContext } from '@/app/_common/contexts/auth.context'

export default function SignOut() {
  const { signOut } = useAuthContext()
  useEffect(() => {
    signOut()
  }, [signOut])
}

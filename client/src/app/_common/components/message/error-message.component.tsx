import { Message } from 'primereact/message'
import { ReactNode } from 'react'
import { formattedError } from './formattedError'

export const MessageError = ({ error, formatted = true }: { error?: ReactNode | string; formatted?: boolean }) => {
  const msg = error && formatted ? formattedError(error) : error
  return (
    msg && (
      <Message
        severity="error"
        className="mb-5 mx-0 bg-error-50 justify-start text-left [&>span]:mx-auto w-full"
        text={msg}
      />
    )
  )
}

export const formattedError = (messageError: string | { error: string } | any) => {
  let message_error =
    typeof messageError === 'string' ? messageError : 'error' in messageError ? messageError.error : 'no results'
  const messages = message_error.split(';')
  if (messages?.length == 1) {
    return <span>{messages[0]}</span>
  }
  return (
    <>
      {messages.map((err: string, idx: number) => {
        return (
          <span key={`error ${idx}`}>
            {idx + 1}. {err}!<br />
          </span>
        )
      })}
    </>
  )
}

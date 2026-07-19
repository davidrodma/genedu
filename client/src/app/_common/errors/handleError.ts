export function handleError(err: any): { error: string } {
  console.log(`ERROR handleError client: %c ${err}`, 'color: red')
  let errorMsg = 'An error has occurred!'
  if (typeof err === 'string') errorMsg = err
  else if (err.respose && err.response.error) errorMsg = err.response.error
  else if (err.response && err.response.data && err.response.data.error) errorMsg = err.response.data.error
  else if (err.message) errorMsg = err.message

  return {
    error: errorMsg,
  }
}

export function delay(seconds: number): Promise<void> {
  const ms = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, ms))
}

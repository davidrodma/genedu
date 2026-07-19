export function textWithLineBreakToArray(text: string) {
  return text
    .replaceAll('\r', '')
    .split('\n')
    .map(line => line.trim())
}

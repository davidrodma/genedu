type colorConsole =
  | 'reset'
  | 'bright'
  | 'dim'
  | 'underscore'
  | 'blink'
  | 'reverse'
  | 'hidden'
  | 'red'
  | 'green'
  | 'yellow'
  | 'black'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
// Mapping colors to ANSI escape codes
const colors: Record<colorConsole, string> = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  black: '\x1b[30m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
}

export function coloredLog(...messages: { content: any; color: colorConsole }[]): void {
  // Applying color to each message
  const coloredMessages = messages.map(message => {
    const contentStr = typeof message.content === 'string' ? message.content : JSON.stringify(message.content, null, 2)
    return colors[message.color] + contentStr + colors.reset
  })

  // Printing the colored message to the console
  console.log(...coloredMessages)
}

export function printCounter(counter: number, total: number) {
  let logOutput = (counter / total) * 100 + '% ' + counter + '/' + total
  process.stdout.write('\r\x1b[K')
  process.stdout.write(logOutput)
  if (counter >= total) {
    process.stdout.write(' -> Completed ')
  }
}

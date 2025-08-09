function info(...args: (string | number | object)[]): void {
  console.log(`[${new Date().toISOString()}]`, '[INFO]', ...args)
}

function error(...args: (string | number | unknown | object)[]): void {
  console.error(`[${new Date().toISOString()}]`, '[ERROR]', ...args)
}

function debug(...args: (string | number | object)[]): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${new Date().toISOString()}]`, '[DEBUG]', ...args)
  }
}

export default {
  info,
  error,
  debug
}
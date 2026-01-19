// Debug logging helper - only logs in development
export function debugLog(location: string, message: string, data: any = {}) {
  if (process.env.NODE_ENV === 'development') {
    fetch('http://127.0.0.1:7243/ingest/943b77db-b2c1-4974-a490-571bb73856af', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location,
        message,
        data,
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'D'
      })
    }).catch(() => {})
  }
}

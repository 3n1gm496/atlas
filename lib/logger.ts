type LogLevel = 'info' | 'warn' | 'error';

type LogPayload = {
  event: string;
  message: string;
  context?: Record<string, unknown>;
};

function writeLog(level: LogLevel, payload: LogPayload) {
  const record = {
    level,
    timestamp: new Date().toISOString(),
    ...payload
  };

  const line = JSON.stringify(record);

  if (level === 'error') {
    console.error(line);
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  console.info(line);
}

export function logInfo(event: string, message: string, context?: Record<string, unknown>) {
  writeLog('info', { event, message, context });
}

export function logWarn(event: string, message: string, context?: Record<string, unknown>) {
  writeLog('warn', { event, message, context });
}

export function logError(event: string, message: string, context?: Record<string, unknown>) {
  writeLog('error', { event, message, context });
}

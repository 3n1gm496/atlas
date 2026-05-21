export const appModes = ['production', 'staging', 'demo'] as const;

export type AppMode = (typeof appModes)[number];

function inferAppMode(): AppMode {
  if (process.env.APP_MODE && appModes.includes(process.env.APP_MODE as AppMode)) {
    return process.env.APP_MODE as AppMode;
  }

  if (process.env.NODE_ENV === 'production') return 'production';
  return 'staging';
}

export function getAppMode(): AppMode {
  return inferAppMode();
}

export function isDemoMode() {
  return getAppMode() === 'demo';
}

export function isProductionMode() {
  return getAppMode() === 'production';
}

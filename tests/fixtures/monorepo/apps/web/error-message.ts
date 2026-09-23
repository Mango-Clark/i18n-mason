const errorMessages = { ACCOUNT_LOCKED: 'accountLocked' } as const;

export function getErrorMessage(code: keyof typeof errorMessages, t: (key: string) => string) {
  return t(errorMessages[code]);
}

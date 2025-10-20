// Shared text/token helpers
export const isPunct = (tok: string) => {
  // Common punctuation tokens present in this app's bank
  return tok.length === 1 && ",.;:!?()[]{}'\"-—–".includes(tok)
}


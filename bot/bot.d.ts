interface Token {
  readonly symbol: string
  readonly address: string
}

type Tokens = readonly Record<string, Token>

interface TokenPair {
  symbols: string
  pairs: string[]
}

interface ArbitragePair {
  symbols: string
  pairs: [string, string]
}

type AmmFactories = readonly Record<string, string>

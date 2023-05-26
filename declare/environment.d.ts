export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      address: string
      private: string
    }
  }
}

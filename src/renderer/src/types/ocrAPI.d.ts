export interface IOcrAPI {
  ask: (url: string, lang: string) => Promise<string>
}

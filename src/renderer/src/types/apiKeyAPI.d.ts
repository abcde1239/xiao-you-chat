export interface IApiKeyAPI {
  onSet(callback: (key?: string) => void): void
  update(key: string): void
}

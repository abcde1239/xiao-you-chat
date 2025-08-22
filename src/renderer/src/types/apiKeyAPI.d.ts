export interface IApiKeyAPI {
  onSet(): Promise<string>
  update(key: string): void
}

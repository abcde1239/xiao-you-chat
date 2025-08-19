export interface IDeepSeekAPI {
  ask(prompt: string): Promise<string>
  onAnswer(callback: (chunk: string) => void): void
}

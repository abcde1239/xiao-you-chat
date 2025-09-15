export interface IBackgroundAPI {
  /*  onSet(callback: (bg: string) => void): void */
  update(bg: string): void
  onSet(): Promise<string>
}

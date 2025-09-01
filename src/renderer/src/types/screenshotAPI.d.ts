export interface IScreenshotAPI {
  start: () => Promise<string>
  save: (selection: { x: number; y: number; width: number; height: number }) => void
  ocr: (selection: { x: number; y: number; width: number; height: number }) => void
  close: () => void
  getOcr: (callback: (data: { img: string; route: string }) => void) => void
}

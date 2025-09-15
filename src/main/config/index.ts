import { app } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'

export interface AppConfig {
  background: string
  apiKey: string
}

const configPath = join(app.getPath('userData'), 'config.json')

const defaultConfig: AppConfig = {
  background: '#1e1e1e',
  apiKey: ''
}

// 确保配置文件存在
if (!existsSync(configPath)) {
  writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2))
}

export function loadConfig(): AppConfig {
  if (existsSync(configPath)) {
    return JSON.parse(readFileSync(configPath, 'utf-8'))
  }
  return defaultConfig
}

export function saveConfig(data: AppConfig): void {
  writeFileSync(configPath, JSON.stringify(data, null, 2))
}

export const winConfig: AppConfig = loadConfig()

import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron'
import { join } from 'path'

export type TrayStatus = 'idle' | 'good' | 'warning' | 'poor'

const STATUS_DOT: Record<TrayStatus, string> = {
  idle: '○',
  good: '●',
  warning: '◐',
  poor: '◉'
}

let trayInstance: Tray | null = null
let currentStatus: TrayStatus = 'idle'
let isPaused = false

function makeIcon(): Electron.NativeImage {
  const iconPath = join(__dirname, '../../resources/icon.png')
  const img = nativeImage.createFromPath(iconPath)
  if (img.isEmpty()) {
    return nativeImage.createEmpty()
  }
  const resized = img.resize({ width: 18, height: 18 })
  if (process.platform === 'darwin') {
    resized.setTemplateImage(true)
  }
  return resized
}

export function createTray(getMainWindow: () => BrowserWindow | null): Tray {
  const tray = new Tray(makeIcon())
  trayInstance = tray
  tray.setToolTip('PosturePal')
  rebuildMenu(getMainWindow)

  tray.on('click', () => {
    const window = getMainWindow()
    if (!window) return
    if (window.isVisible()) window.hide()
    else window.show()
  })

  return tray
}

function rebuildMenu(getMainWindow: () => BrowserWindow | null): void {
  if (!trayInstance) return
  const window = getMainWindow()
  const menu = Menu.buildFromTemplate([
    {
      label: `Status: ${currentStatus}`,
      enabled: false
    },
    { type: 'separator' },
    {
      label: window?.isVisible() ? 'Hide window' : 'Show window',
      click: () => {
        const w = getMainWindow()
        if (!w) return
        if (w.isVisible()) w.hide()
        else w.show()
      }
    },
    {
      label: isPaused ? 'Resume monitoring' : 'Pause monitoring',
      click: () => {
        isPaused = !isPaused
        rebuildMenu(getMainWindow)
      }
    },
    { type: 'separator' },
    {
      label: 'Quit PosturePal',
      click: () => {
        app.quit()
      }
    }
  ])
  trayInstance.setContextMenu(menu)
  trayInstance.setToolTip(`PosturePal — ${STATUS_DOT[currentStatus]} ${currentStatus}`)
}

export function setTrayStatus(status: TrayStatus, getMainWindow: () => BrowserWindow | null): void {
  currentStatus = status
  rebuildMenu(getMainWindow)
}

export function isMonitoringPaused(): boolean {
  return isPaused
}

module.exports = {
  center: false,

  closable: false,
  frame: false,
  maximizable: false,
  minimizable: false,
  movable: false,
  resizable: false,
  thickFrame: false,

  autoHideMenuBar: true,
  enableLargerThanScreen: false,
  fullscreenable: true,
  skipTaskbar: true,
  
  backgroundColor: "#ffffff",
  titleBarStyle: "hidden",

  fullscreen: true,
  // kiosk: true,

  webPreferences: {
    defaultEncoding: "utf8",

    devTools: false,
    nodeIntegration: false,
    nodeIntegrationInWorker: false,
    nodeIntegrationInSubFrames: false,
    enableRemoteModule: false,

    backgroundThrottling: false,
    spellcheck: false,

    experimentalFeatures: true,
  },
}
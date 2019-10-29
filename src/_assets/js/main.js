const path = require('path')

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
// const { app, BrowserWindow, Menu, shell } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 1124,
    title: 'BrandMail',
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, '../img/icons/png/64x64.png')
  })

  // and maximize it
  mainWindow.maximize()

  // and load the index.html of the app.
  mainWindow.loadFile('build/app/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // TODO: Add custom application menu including important native functions (i.e. copy/paste, select all, quit, etc.)
  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: 'Menu',
  //     submenu: [
  //       { label: 'Send Emails' },
  //       { type: 'separator' },
  //       {
  //         label: 'Quit',
  //         click () {
  //           app.quit()
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     label: 'Help',
  //     submenu: [
  //       {
  //         label: 'Open Browser',
  //         click () {
  //           shell.openExternal('https://google.com')
  //         }
  //       }
  //     ]
  //   }
  // ])

  // Menu.setApplicationMenu(menu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') app.quit()
  app.quit()
})

// Receive event from renderer process
ipcMain.on('close-app', (event, arg) => {
  app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

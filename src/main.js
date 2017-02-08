const electron = require('electron')
const countdown = require('./countdown')
const path = require('path')


const { app, Menu, Tray, BrowserWindow } = electron

//const app = electron.app
//const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
//const Menu = electron.Menu
//const Tray = electron.Tray

let win

app.on('ready', _=> {

    const tray = new Tray(path.join('src', 'trayIcon.png'))

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Wow',
            click: _ => console.log('wow')
        },
        {
            label: 'Awesome',
            click: _ => console.log('awesome')
        }
    ])

    tray.setContextMenu(contextMenu)
    tray.setToolTip('My great app')

    



    const name = electron.app.getName() // productName in package.json
    const template = [
        {
            label: name,
            submenu: [{
                label: `About ${name}`,
                click: _=> {
                    console.log('clicked about')
                }
            }, {
                type: 'separator'
            }, {
                label: 'Quit',
                click: _=> { app.quit() },
                accelerator: 'Ctrl+Q'
            }]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    win = new BrowserWindow({
        height: 400,
        width: 400
    })

    win.loadURL(`file://${__dirname}/countdown.html`)

    win.on('closed', _=> {
        win = null
    })
})

ipc.on('countdown-start', _=> {
    countdown(count => {
        win.webContents.send('countdown', count)
    })    
})
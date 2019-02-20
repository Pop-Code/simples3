const { Menu, BrowserWindow, app } = require('electron');
const url = require('url');
const path = require('path');
let windows = new Set();

function isDev() {
    const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
    const fromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
    return isEnvSet ? fromEnv : !app.isPackaged;
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 700,
        minWidth: 750,
        minHeight: 550,
        show: false,
        title: 'App',
        autoHideMenuBar: true,
        darkTheme: true,
        vibrancy: 'appearance-based',
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true
        }
    });
    

    const startUrl =
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '/build/index.html'),
            protocol: 'file:',
            slashes: true
        });

    win.loadURL(startUrl);

    win.once('ready-to-show', () => {
        win.show();
    });
    win.on('closed', () => {
        windows.delete(win);
    });
    
    windows.add(win);
}

app.on('window-all-closed', () => {
    // app.quit();
});

app.on('ready', createWindow);

app.on('activate', () => {
    if (windows.size === 0) {
        createWindow();
    }
});

const template = [
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'pasteandmatchstyle' },
            { role: 'delete' },
            { role: 'selectall' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        role: 'window',
        submenu: [{ role: 'minimize' }, { role: 'close' }]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() {
                    require('electron').shell.openExternal('https://electronjs.org');
                }
            }
        ]
    }
];

if (isDev()) {
    template[1].submenu.push(
        ...[{ type: 'separator' }, { role: 'reload' }, { role: 'forcereload' }, { role: 'toggledevtools' }]
    );
}

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    });

    // Edit menu
    template[1].submenu.push(
        { type: 'separator' },
        {
            label: 'Speech',
            submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
        }
    );

    // Window menu
    template[3].submenu = [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
    ];
}

Menu.setApplicationMenu(Menu.buildFromTemplate(template));

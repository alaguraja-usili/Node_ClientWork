const { registerWin, getWin } = require("../WindowManager");

module.exports.MenuWindow = class MenuWindow {
  static getWindow() {
    const type = "menu";
    const target = getWin(type);

    if (!target) {
      // console.log("Creating new menu window");
      return false;
    } else {
      // console.log("Returning existing menu window");
      return target;
    }
  }

  static initializeWindow = (cb) => {
    const { DataStore } = require("../DataStore");
    const windowStateKeeper = require("electron-window-state");
    const path = require("path");
    const { BrowserWindow, ipcMain, app, Menu, Tray, nativeImage } = require("electron");

    // Create the browser window.
    const iconPath = app.isPackaged ? path.join(__dirname, "../../../app.asar.unpacked/assets/logo_Jvr_icon.ico") : path.join(__dirname, "../Logo/logo_Jvr_icon.ico");
    console.log(iconPath);

    let menuWindowState = windowStateKeeper({
      defaultWidth: 1280,
      defaultHeight: 720,
    });

    const opts = {
      icon: iconPath,
      minWidth: 400,
      minHeight: 500,
      x: menuWindowState.x,
      y: menuWindowState.y,
      width: menuWindowState.width,
      height: menuWindowState.height,
      show: false,
      frame: false,
      backgroundColor: "#1c1c1c",
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false

      },
    };

    const type = "menu";

    const target = registerWin(opts, type).win;

    target.openDevTools();

    menuWindowState.manage(target);

    target.hide();

    // and load the index.html of the app.
    if (process.env.NODE_ENV === "test") {
      target.loadURL("http://localhost:3000");
    } else {
      target.loadFile("build/index.html");
    }

    target.webContents.on('new-window', function(e, url) {
      e.preventDefault();
      // require('electron').shell.openExternal(url);
    });

    // I want one that runs a .msix file
    ipcMain.on('open-msix-file', function(e) {
      const { spawn } = require('child_process');

      const msixbundlePath = path.join(app.getAppPath(), 'Crosshair_X_Extension_Setup.msixbundle');
      console.log(msixbundlePath);

      // open file explorer 
      spawn('explorer.exe', [msixbundlePath]);
      
    });

    target.webContents.once("did-finish-load", () => {
      console.log("Menu window finished loading!");
  
          require("../CrosshairControl/control").configure();


          if (DataStore.getStore().get("minimizeOnLaunch") === false) {
            target.show();
          } else {
            target.minimize();
          }


          

          // Test
          const image = nativeImage.createFromPath(iconPath)

          const appIcon = new Tray(image);

          const contextMenu = Menu.buildFromTemplate([
            {
              label: "Exit",
              click: () => {
                try {
                  MenuWindow.getWindow().destroy();
                } catch (e) {
                  console.log("Error pressing Exit in MenuWindow.js: ", e);
                  const Sentry = require("@sentry/electron");
                  Sentry.captureMessage("Error pressing Exit in MenuWindow.js:");
                }
              },
            },
          ]);

          

          appIcon.setToolTip("Crosshair X");
          appIcon.setContextMenu(contextMenu);
          appIcon.on("double-click", (event, bounds) => {
            try {
              target.show();
            } catch (e) {
              console.log(e);
              const Sentry = require("@sentry/electron");
              Sentry.captureMessage("Error pressing icon in MenuWindow.js:");
            }
          });


          cb();

          return target;
    });

    target.on("closed", function () {
      console.log("Menu window on closed!");

      // Destroy all BrowserWindows and quit the app
      app.quit();

    
    });

    target.on("maximize", () => {
      try {
        target.webContents.send("maximize");
      } catch (e) {
        console.log(e);
        const Sentry = require("@sentry/electron");
        Sentry.captureMessage("Error pressing maximize in MenuWindow.js:");
      }
    });

    target.on("unmaximize", () => {
      try {
      target.webContents.send("unmaximize");
      } catch (e) {
        console.log(e);
        const Sentry = require("@sentry/electron");
        Sentry.captureMessage("Error pressing unmaximize in MenuWindow.js:");
      }
    });

    ipcMain.on("minimize-app", (evt, arg) => {
      try {
        target.minimize();
      } catch (e) {
        console.log(e);
        const Sentry = require("@sentry/electron");
        Sentry.captureMessage("Error pressing minimize in MenuWindow.js:"); 
      }

    });

    ipcMain.on("unmaximize-app", (evt, arg) => {
      try {
        target.unmaximize();
      } catch (e) {
        console.log(e);
        const Sentry = require("@sentry/electron");
        Sentry.captureMessage("Error pressing unmaximize in MenuWindow.js:");
      }
    });

    ipcMain.on("maximize-app", (evt, arg) => {
      try {
        target.maximize();
      } catch (e) {
        console.log(e);
        const Sentry = require("@sentry/electron");
        Sentry.captureMessage("Error pressing maximize in MenuWindow.js:");
      }
    });

    ipcMain.on("close-app", (evt, arg) => {
      try {
      target.hide();
      } catch (e) {
        console.log(e);
        const Sentry = require("@sentry/electron");
        Sentry.captureMessage("Error pressing close in MenuWindow.js:");
      }
    });

    ipcMain.on("getMaximized", (event, arg) => {
      try {
        event.returnValue = target.isMaximized();
      } catch (e) {
        console.log(e);
        const Sentry = require("@sentry/electron");
        Sentry.captureMessage("Error pressing getMaximized in MenuWindow.js:"); 
        event.returnValue = false;
      }
    });
  };
};

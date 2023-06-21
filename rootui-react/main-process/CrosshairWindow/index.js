const { registerWin, getWin } = require("../WindowManager");

module.exports.CrosshairWindow = class CrosshairWindow {
  static crosshairWindow;

  static getWindow() {
    const type = "crosshair";
    const target = getWin(type);
    if (!target) {
      // console.log("Creating new crosshair window");
      return false;
    } else {
      // console.log("Returning existing crosshair window");
      return target;
    }
  }

  static inititializeWindow = (cb) => {
    const { screen, ipcMain } = require("electron");
    const path = require("path");

    const opts = {
      skipTaskbar: true,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      show: false,
      minimizable: false,
      focusable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        transparent: true,
      },
    };

    console.log("Initializing crosshair window");
    const type = "crosshair";

    const target = registerWin(opts, type).win;
    target.setIgnoreMouseEvents(true);

    target.setAlwaysOnTop(true, "screen-saver");

    // and load the index.html of the app.
    target.loadFile(path.join(__dirname, "crosshair.html"));
    // target.webContents.openDevTools();

    // Find out from the data store if the crosshair window should be shown
     const { DataStore } = require("../DataStore");
     const isUsingExclusiveFullscreen = DataStore.getStore().get("isUsingExclusiveFullscreen");
      if (!isUsingExclusiveFullscreen) {
        target.show();
      } else {
        target.hide();
      }


    ipcMain.handle('showCrosshairWindow', (event, arg) => {
      // check if the target (BrowswerWindow) is alrready showing
      // if so, don't do anything
      if (!target.isVisible()) {

      console.log("Showing crosshair window");
      target.show();
      // const {DataStore} = require("../DataStore");

      const width = screen.getPrimaryDisplay().size.width,
      height = screen.getPrimaryDisplay().size.height;

      const ratio = 5 / 6;
      target.setBounds({
        width: Math.ceil(width * ratio),
        height: Math.ceil(height * ratio),
        x: Math.ceil(width / 2) - Math.ceil(width * ratio / 2),
        y: Math.ceil(height / 2) - Math.ceil(height * ratio / 2),
      });

    // if the window is not on top, then set it to on top
    if (!target.isAlwaysOnTop()) {
      target.setAlwaysOnTop(true, "screen-saver");
    }
  } else {
    console.log("Crosshair window already showing");
  }
    });

    ipcMain.handle('hideCrosshairWindow', (event, arg) => {
      if (target.isVisible()) {
      console.log("Hiding crosshair window");
      target.hide();
      } else {
        console.log("Crosshair window already hidden");
      }

    });

    screen.addListener(
      "display-metrics-changed",
      (event, display, changedMetrics) => {
        try {
          console.log("Display metrics changed");
          target.center();
          console.log("Centered crosshair window");
          const width = screen.getPrimaryDisplay().size.width,
            height = screen.getPrimaryDisplay().size.height;

            const ratio = 5 / 6;
            target.setBounds({
              width: Math.ceil(width * ratio),
              height: Math.ceil(height * ratio),
              x: Math.ceil(width / 2) - Math.ceil(width * ratio / 2),
              y: Math.ceil(height / 2) - Math.ceil(height * ratio / 2),
            });

          target.setAlwaysOnTop(true, "screen-saver");
        } catch (e) {
          const Sentry = require("@sentry/electron");
          console.log("Something went wrong display metrics changed", e);
          Sentry.captureMessage("Something went wrong display metrics changed");
        }
      }
    );

    screen.addListener("display-added", (event, newDisplay) => {
      try {
        console.log("Display added");
        target.center();
        console.log("Centered crosshair window");

        const width = screen.getPrimaryDisplay().size.width,
          height = screen.getPrimaryDisplay().size.height;

          const ratio = 5 / 6;
          target.setBounds({
            width: Math.ceil(width * ratio),
            height: Math.ceil(height * ratio),
            x: Math.ceil(width / 2) - Math.ceil(width * ratio / 2),
            y: Math.ceil(height / 2) - Math.ceil(height * ratio / 2),
          });

        target.setAlwaysOnTop(true, "screen-saver");
      } catch (e) {
        const Sentry = require("@sentry/electron");
        Sentry.captureMessage("Something went wrong display added");
        console.log("Something went wrong display added", e);
      }
    });

    screen.addListener("display-removed", (event, oldDisplay) => {
      try {
        console.log("Display removed");
        target.center();
        console.log("Centered crosshair window");

        const width = screen.getPrimaryDisplay().size.width,
          height = screen.getPrimaryDisplay().size.height;

        // Set the bounds of the window so that the window is centered and only takes up 5/6 of the screen dimensions. Use the target.setBounds() method to set the bounds of the window.
        const ratio = 5 / 6;
        target.setBounds({
          width: Math.ceil(width * ratio),
          height: Math.ceil(height * ratio),
          x: Math.ceil(width / 2) - Math.ceil(width * ratio / 2),
          y: Math.ceil(height / 2) - Math.ceil(height * ratio / 2),
        });

          

        target.setAlwaysOnTop(true, "screen-saver");
      } catch (e) {
        const Sentry = require("@sentry/electron");
        Sentry.captureMessage("Something went wrong display removed");
        console.log("Something went wrong display removed", e);
      }
    });

    target.webContents.on(
      "console-message",
      (event, level, message, line, sourceId) => {
        console.log(message + " " + sourceId + " (" + line + ")");
      }
    );

    target.webContents.once("did-finish-load", () => {
      console.log("Crosshair Window Finished loading!");
      if (cb) cb();
    });


  };
};

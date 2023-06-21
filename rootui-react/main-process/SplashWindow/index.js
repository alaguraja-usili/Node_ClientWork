const { registerWin, getWin } = require("../WindowManager");

module.exports.SplashWindow = class {
  static getWindow() {
    const type = "splash";
    const target = getWin(type);
    return target;
  }

  static initializeWindow = (cb) => {
    const path = require("path");
    // Create a splash window (spinning logo)
    const iconPath = path.join(__dirname, "../Logo/logo_Jvr_icon.ico");

    const opts = {
      icon: iconPath,
      width: 150,
      height: 150,
      frame: false,
      alwaysOnTop: true,
      backgroundColor: "#000",
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        transparent: true,
      },
    };

    const type = "splash";

    const target = registerWin(opts, type).win;


    const splashPath = path.join(__dirname, "splash.html");

    target.loadFile(splashPath);

    target.webContents.on("destroyed", () => {
      console.log("Splash window destroyed!");
    });

    target.once('ready-to-show', () => {
      console.log("Splash Window Finished loading!");
      target.show();

      cb();
    })

    // when i log something in the renderer process, I also want to log it in the main process
    target.webContents.on("console-message", (event, level, message, line, sourceId) => {
      console.log(`Splash Window: ${message}`);
    });



  };
};

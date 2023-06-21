
/* Main electron import */
const { app, Menu, protocol, dialog, ipcRenderer, ipcMain} = require('electron')



  const { DataStore } = require('./main-process/DataStore');
  
  DataStore.configure();
 
// Read the current version from the package.json file
let currentVersion = app.getVersion();

// Call axios to get the latest version from this api https://ezr07ghs46.execute-api.us-east-1.amazonaws.com/Prod/hello/
// if the distribution is steam, then check the latest version from the steam api









  app.whenReady().then(() => setTimeout(() => {

    console.log("App ready")
    // protocol.registerFileProtocol('file', (request, callback) => {
    //   const pathname = decodeURI(request.url.replace('file:///', ''));
    //   console.log("Pathname: " + pathname);
    //   callback(pathname);
    // });

    const { SplashWindow } = require('./main-process/SplashWindow')
    console.log("SplashWindow initialized")

    // Initialize App Windows
    SplashWindow.initializeWindow(() => {
      console.log('Splash window visible');

      const { CrosshairWindow } = require('./main-process/CrosshairWindow')
      console.log("CrosshairWindow initialized")

      const { MenuWindow } = require('./main-process/MenuWindow')
      console.log("MenuWindow initialized")

     

      const { SaveCrosshair } = require('./main-process/DataStore/saveCrosshair.js');
      console.log("SaveCrosshair initialized")

      const { SaveCrosshairImage } = require('./main-process/SaveCrosshairImage/index.js');
      console.log("SaveCrosshairImage initialized")

      const { CustomImages } = require('./main-process/CustomImages/index.js');
      console.log("CustomImages initialized")

     CrosshairWindow.inititializeWindow(() => {
        console.log("CrosshairWindow configured");
        MenuWindow.initializeWindow(() => {
          console.log("MenuWindow configured");

          Menu.setApplicationMenu(null);
          console.log("Menu configured");
    
          SaveCrosshair.configure();
          console.log("SaveCrosshair configured");

          SaveCrosshairImage.configure();
          console.log("SaveCrosshairImage configured");

          CustomImages.configure();
          console.log("CustomImages configured");

          CrosshairWindow.getWindow().hide();
          // Every 30 seconds make sure the crosshair window is on top with a try catch
          setInterval(() => {
            try {
              CrosshairWindow.getWindow().setAlwaysOnTop(true, "screen-saver");
            } catch (e) {
              console.log("Error setting crosshair window on top")
            }
          }, 30000)
          console.log("CrosshairWindow always on top configured");
        
          // try to destroy the splash window if it exists and hasnt been closed yet
          const splashWindow = SplashWindow.getWindow();
          if (splashWindow) {
            try {
            splashWindow.destroy();
            } catch (e) {
              console.log("Error destroying splash window")
            }
          }
        });
      });
    });
  }, 500));

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      console.log("All windows closed, quitting")
      app.quit()
    }
  })



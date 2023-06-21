const { emptyCrosshair } = require("../CrosshairModel");

module.exports.SaveCrosshair = class SaveCrosshair {
  static configure = () => {
    const { ipcMain } = require("electron");
    const { DataStore } = require("./index");

    ipcMain.on("saveNewCrosshair", (evt, crosshairId, source, name, keyboardShortcut) => {
      const savedCrosshairs = DataStore.getStore().get("savedCrosshairs");

      const newCrosshair = 
        {
          name,
          pos: {
            x: 0,
            y: 0,
          },
        };

        if (keyboardShortcut) {
            newCrosshair.keyboardShortcut = keyboardShortcut;
        }

        if (source) {
          if (source !== "customimages") {
            newCrosshair.model = JSON.parse(crosshairId)
          } else {
            newCrosshair.model = emptyCrosshair.drawing;
            newCrosshair.image = JSON.parse(crosshairId);
          }
        }


      savedCrosshairs.push(newCrosshair);

      const content = {
        drawing: JSON.parse(crosshairId),
      };

      if (name) {
        content.name = name;
      }

      if (source) {
        content.source = source;

        if (source != "customimages") {
        } else {

        }
      }

      DataStore.getStore().set("savedCrosshairs", savedCrosshairs);
    });
  };
};

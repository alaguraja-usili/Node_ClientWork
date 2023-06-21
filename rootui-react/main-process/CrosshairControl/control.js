const { ipcMain, app } = require("electron");
const { CrosshairControl } = require(".");
const { getWin } = require("../WindowManager");

// Create a state singleton to track windows against
const state = {};

const configure = () => {
  setUpState();
  configureHandlers();
  updateCrosshairWindows();
};

const configureHandlers = () => {
  // import datastore
  const { DataStore } = require("../DataStore");

  ipcMain.handle("setCrosshairPosition", (event, x, y) => {
    updateState({type: "SET_CROSSHAIR_POSITION", payload:{ x, y }});
  });

  ipcMain.handle("hideCrosshair", (event, hidden) => {
    state.isCrosshairHidden = hidden;
    updateCrosshairWindows();
  });

  // ipc main handler for updating crosshair visibility settings
  ipcMain.handle("setCrosshairToggleRightClick", (event, action, mode) => {
    console.log("Getting message from renderer");
    updateState({type:"SET_CROSSHAIR_TOGGLE_RIGHT_CLICK"});
  });

  ipcMain.on("setCurrentActiveCrosshair", (event, crosshairStr, type, name) => {
    type = setCurrentActiveCrosshair(type, DataStore, crosshairStr, event, name);
    state.isSavedCrosshairVisible = false;
  });

  ipcMain.on('restart-app', () => {
    // Make the app restart
    app.relaunch();
    app.exit(0);
  });
}

const setUpState = () => {
   // import datastore
   const { DataStore } = require("../DataStore");

   // set crosshair type from datastore
   state.crosshairType = DataStore.getStore().get("crosshairType");
   if (state.crosshairType === "customimages") {
     state.crosshairImage = DataStore.getStore().get("crosshairImage");
   } else {
    state.crosshairImage = CrosshairControl.processDesignerModel(undefined, DataStore.getStore().get("crosshairImage"), null, undefined, true);
   }
 
   // set crosshair offset from datastore
   state.crosshairOffset = DataStore.getStore().get("crosshairOffset");
 
   // set doesRightClickHideCrosshair from datastore
   state.rightClickCrosshairToggle = {
      doesRightClickHideCrosshair: DataStore.getStore().get("doesRightClickHideCrosshair"),
      doesRightClickShowCrosshair: DataStore.getStore().get("doesRightClickShowCrosshair"),
      isHoldToggleEnabled: DataStore.getStore().get("isHoldToggleEnabled"),
      isSingleClickToggleEnabled: DataStore.getStore().get("isSingleClickToggleEnabled"),
      selectedSavedCrosshair: DataStore.getStore().get("selectedSavedCrosshair"),
      selectedSavedMode: DataStore.getStore().get("selectedSavedMode")
   };

   state.isHiddenByKeyboard = false;
   state.isSavedCrosshairVisible = false;
}

const updateState = (action) => {
  const { DataStore } = require("../DataStore");
  
  switch (action.type) {
    case "SET_CROSSHAIR_TOGGLE_RIGHT_CLICK":
      state.rightClickCrosshairToggle = {
        doesRightClickHideCrosshair: DataStore.getStore().get("doesRightClickHideCrosshair"),
        doesRightClickShowCrosshair: DataStore.getStore().get("doesRightClickShowCrosshair"),
        isHoldToggleEnabled: DataStore.getStore().get("isHoldToggleEnabled"),
        isSingleClickToggleEnabled: DataStore.getStore().get("isSingleClickToggleEnabled"),
        selectedSavedCrosshair: DataStore.getStore().get("selectedSavedCrosshair"),
        selectedSavedMode: DataStore.getStore().get("selectedSavedMode")
      };

      state.isSavedCrosshairVisible = false;

      console.log("Setting crosshair toggle right click", state.rightClickCrosshairToggle)

      if (state.rightClickCrosshairToggle.isHoldToggleEnabled) {
        if (state.rightClickCrosshairToggle.doesRightClickHideCrosshair) {
          state.isCrosshairHidden = false;
        } else if (state.rightClickCrosshairToggle.doesRightClickShowCrosshair) {
          state.isCrosshairHidden = true;
        } else if (state.rightClickCrosshairToggle.selectedSavedCrosshair) {
          state.isCrosshairHidden = false;
        }
      } else {
        state.isCrosshairHidden = false;
      }

      try {
      require("../MenuWindow")
      .MenuWindow.getWindow()
      .webContents.send("setCrosshairHidden", state.isCrosshairHidden);
      } catch (e) {
        console.log(e);
        const Sentry = require("@sentry/electron");
        Sentry.captureMessage("Something went wrong setting crosshair hidden");
      }

      updateCrosshairWindows(true);
      break;
    case "SET_CROSSHAIR_POSITION":
      DataStore.getStore().set("crosshairOffset", action.payload);
      state.crosshairOffset = action.payload;
      updateCrosshairWindows(true);
      break;
    case "SET_LEFT_MOUSE_STATE":
      state.leftMouseState = action.payload;
      updateCrosshairWindows(true);
      state.leftMouseState = {button: 'none', action: 'none'};
      break;
      case "SET_RIGHT_MOUSE_STATE":
        state.rightMouseState = action.payload;
        break;
    case "SET_CROSSHAIR_HIDDEN":
      state.isCrosshairHidden = action.payload;
      updateCrosshairWindows(true);
      break;
    case "SET_CROSSHAIR_SAVED":
      state.isSavedCrosshairVisible = action.payload;
      updateCrosshairWindows(true);
      break;
    case "TOGGLE_CROSSHAIR_SAVED":
      state.isSavedCrosshairVisible = !state.isSavedCrosshairVisible;
      updateCrosshairWindows(true);
      break;
    case "TOGGLE_CROSSHAIR_HIDDEN_KEYBOARD":
      state.isHiddenByKeyboard = !state.isHiddenByKeyboard;
      try {
      require("../CrosshairWindow")
      .CrosshairWindow.getWindow()
      .setAlwaysOnTop(true, "screen-saver");
      } catch (e) {
        console.log("Something went wrong setting crosshair hidden with keyboard", e);
        const Sentry = require("@sentry/electron");
        Sentry.captureMessage("Something went wrong setting crosshair hidden with keyboard");
      }
      updateCrosshairWindows(true);
      break;

    case "TOGGLE_CROSSHAIR_HIDDEN":
      state.isCrosshairHidden = !state.isCrosshairHidden;
      // Updates the UI to reflect the new state
      try {
        require("../MenuWindow")
        .MenuWindow.getWindow()
        .webContents.send("setCrosshairHidden", state.isCrosshairHidden);
  
        // Keeps the crosshair window always on top
        require("../CrosshairWindow")
        .CrosshairWindow.getWindow()
        .setAlwaysOnTop(true, "screen-saver");
      } catch (error) {
        console.log("Something went wrong toggling crosshair hidden", error);
        const Sentry = require("@sentry/electron");
        Sentry.captureMessage("Something went wrong toggling crosshair hidden");
      }


      updateCrosshairWindows(true);
      break;

  }

  
};

const updateCrosshairWindows = (shouldRemoveB64) => {
  // send state to app service
  let objToSend;

  if (!state.rightClickCrosshairToggle.selectedSavedCrosshair && shouldRemoveB64 && state.crosshairType === "customimages") {
    // create a deep copy of the state
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.crosshairImage = JSON.parse(stateCopy.crosshairImage);

    // remove the base64 image in JSON.parse(state.crosshairImage).b64 if it exists and shouldRemoveB64 is true
    delete stateCopy.crosshairImage.b64;


    stateCopy.crosshairImage = JSON.stringify(stateCopy.crosshairImage);
    objToSend = stateCopy;
  } else {
    // create a deep copy of the state
    const stateCopy = JSON.parse(JSON.stringify(state));

    objToSend = stateCopy;
  }

  if (state.isSavedCrosshairVisible) {
    if (state.rightClickCrosshairToggle.selectedSavedCrosshair.image) {
      objToSend.crosshairImage = JSON.stringify(state.rightClickCrosshairToggle.selectedSavedCrosshair.image);
      objToSend.crosshairType = "customimages";
      console.log("Sending saved crosshair image", objToSend.crosshairImage.b64)
    } else {
      objToSend.crosshairImage = CrosshairControl.processDesignerModel(undefined,  state.rightClickCrosshairToggle.selectedSavedCrosshair.model, state.crosshairType, undefined, true);
      objToSend.crosshairType = "model";
    }
  }

  // add is using fullscreen crosshair to state from datastore
  const { DataStore } = require("../DataStore");
  objToSend.isUsingExclusiveFullscreen = DataStore.getStore().get("isUsingExclusiveFullscreen");

  // if the crosshair is hidden by keyboard, set the crosshair to hidden
  if (state.isHiddenByKeyboard) {
    objToSend.isCrosshairHidden = true;
  }

  // console.log("Sent with ", objToSend.isUsingExclusiveFullscreen)


  // send state to browser window
  const target = getWin("crosshair");
  if (target) {
    target.webContents.send("update", objToSend);
  } else {
    console.log("No target window found");
  }


};

const getState = () => {
  return state;
};


module.exports = {
  updateState,
  updateCrosshairWindows,
  configure,
  getState,
  setCurrentActiveCrosshair
};



function setCurrentActiveCrosshair(type, DataStore, crosshairStr, event, name) {
  if (!type) {
    type = "model";
  }
  let shouldRemoveB64 = false;

  // if the type is customimages then we need to fetch the base64 value from the image
  // because the gamebar extension doesn't have access to the file system
  // if (type === "customimages") {
  //   const obj = JSON.parse(crosshairStr);
  //   const fs = require("fs");
  //   console.log(obj.path);
    
  //   const b64 = fs.readFileSync(obj.path, { encoding: "base64" });

  //   obj.b64 = b64;
  //   crosshairStr = JSON.stringify(obj);
    
  // }

  const oldCrosshair = DataStore.getStore().get("crosshairImage");

  // // Setting the current active crosshair in the state and data store
  DataStore.getStore().set("crosshairImage", crosshairStr);
  DataStore.getStore().set("crosshairType", type);

  // check if state.crosshairType is a string and not an object
  if (type === "customimages") {
    shouldRemoveB64 = !(state.crosshairType != "customimages" || JSON.parse(state.crosshairImage).b64 != JSON.parse(crosshairStr).b64)

    state.crosshairImage = crosshairStr;
  } else {
    let shouldSendEvent = (state.crosshairType == "customimages" || crosshairStr != oldCrosshair) && type != "designupdate";

    // console.log("Configure crosshair model and should send event", shouldSendEvent);

    state.crosshairImage = CrosshairControl.processDesignerModel(event, crosshairStr, type, name, shouldSendEvent);
  }

  state.crosshairType = type;

  // Check if the crosshair is hidden, if it is, send a message to the browser window to show the crosshair
  if (state.isCrosshairHidden) {
    try {
    require("../MenuWindow")
    .MenuWindow.getWindow()
    .webContents.send("setCrosshairHidden", false);
    } catch (e) {
      console.log("Something went wrong setting crosshair hidden", e);
      const Sentry = require("@sentry/electron");
      Sentry.captureMessage("Something went wrong setting crosshair hidden");
    }

    // Also set the state to false
    state.isCrosshairHidden = false;
  }




    updateCrosshairWindows(shouldRemoveB64);
    return type;
  
}


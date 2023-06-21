const { ipcRenderer } = require("electron");

ipcRenderer.send("put-in-tray");

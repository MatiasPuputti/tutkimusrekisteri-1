const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const env = require("dotenv");

env.config();

// Database refernce
const db = require(path.resolve(".", "models"));

///FORCING DROPS THE DATABASE ! FOR TESTING PURPOSES ONLY ! MUST BE REMOVED !
db.sequelize.sync({ force: true });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile("index.html");

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// get filepath from rendered method
ipcMain.on("dataChannel", async (event, obj, file) => {
  let ids = readCsv(file);
  let rs = db.Research.create(obj);
  Promise.all([rs, ids]).then(([research, data]) => {
    data.forEach(async value => {
      let [person, _] = await db.Person.findOrCreate({
        where: { identificationNumber: value.HETU }
      });
      research.addPerson(person, {
        through: { identificationHash: value.HASH }
      });
    });
  });
});

// Finds all the researches where ID belongs.
ipcMain.on("idNumber", async (e, id) => {
  console.log(`ID:: ${id}`);
  let person = await db.Person.findByPk(id);
  console.log(`PERSON:: ${person}`);
  let researches = await person[0].getResearches();
  ipcMain.send("researches", researches);
});

// Finds all people belonging to research
ipcMain.on("research", async (e, id) => {
  let research = await db.Research.findByPk(id);
  let people = await research.getPeople({
    joinTableAttributes: ["identificationHash"]
  });
  ipcMain.send("researchPeople", people);
});

async function readCsv(filepath) {
  const csv = require("csv-parser");
  const fs = require("fs");
  const results = [];

  await fs
    .createReadStream(filepath)
    .pipe(csv())
    .on("data", data => results.push(data))
    .on("end", () => console.log("File readed"));
  return results;
}

const { app, BrowserWindow, Menu, protocol, shell, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

// One instance only
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  const exeDir = path.dirname(app.getPath("exe"));

  // Portable data folder next to the exe (saves, imports, records)
  try { app.setPath("userData", path.join(exeDir, "data")); } catch (e) {}

  // Let the game start audio without an extra gesture (game has play buttons anyway)
  app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

  protocol.registerSchemesAsPrivileged([
    {
      scheme: "opus",
      privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true },
    },
  ]);

  const APP_DIR = __dirname;

  async function handleProtocol(request) {
    try {
      const u = new URL(request.url);
      let rel = decodeURIComponent(u.pathname || "/");
      if (rel === "/" || rel === "") rel = "/OPUS.html";
      const filePath = path.normalize(path.join(APP_DIR, rel));
      if (filePath !== APP_DIR && !filePath.startsWith(APP_DIR + path.sep)) {
        return new Response("forbidden", { status: 403 });
      }
      const data = await fs.promises.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const mime = ext === ".html" ? "text/html; charset=utf-8"
        : ext === ".png" ? "image/png"
        : ext === ".js" ? "text/javascript; charset=utf-8"
        : "application/octet-stream";
      return new Response(data, { headers: { "content-type": mime } });
    } catch (e) {
      return new Response("not found", { status: 404 });
    }
  }

  let win = null;

  function sendFullscreenState() {
    if (win && !win.isDestroyed()) {
      win.webContents.send("opus:fullscreen-state", win.isFullScreen());
    }
  }

  function createWindow() {
    win = new BrowserWindow({
      width: 1360,
      height: 768,
      minWidth: 900,
      minHeight: 500,
      backgroundColor: "#0b0910",
      title: "OPUS",
      icon: path.join(APP_DIR, "icon.png"),
      autoHideMenuBar: true,
      show: false,
      webPreferences: {
        preload: path.join(APP_DIR, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        backgroundThrottling: false,
        spellcheck: false,
      },
    });
    Menu.setApplicationMenu(null);
    win.setMenuBarVisibility(false);

    win.loadURL("opus://app/OPUS.html");

    win.once("ready-to-show", () => {
      win.maximize();
      win.show();
    });

    win.on("enter-full-screen", sendFullscreenState);
    win.on("leave-full-screen", sendFullscreenState);

    // F11 = fullscreen, F12 = devtools (troubleshooting)
    win.webContents.on("before-input-event", (event, input) => {
      if (input.type !== "keyDown") return;
      if (input.key === "F11") {
        win.setFullScreen(!win.isFullScreen());
        event.preventDefault();
      } else if (input.key === "F12") {
        win.webContents.toggleDevTools();
        event.preventDefault();
      }
    });

    // external links -> default browser
    win.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: "deny" };
    });

    win.on("closed", () => { win = null; });
  }

  // fullscreen button (from preload) -> toggle this window
  ipcMain.on("opus:toggle-fullscreen", (event) => {
    const w = BrowserWindow.fromWebContents(event.sender);
    if (!w) return;
    w.setFullScreen(!w.isFullScreen());
  });

  app.whenReady().then(() => {
    protocol.handle("opus", handleProtocol);
    createWindow();

    app.on("second-instance", () => {
      if (win) {
        if (win.isMinimized()) win.restore();
        win.focus();
      }
    });
  });

  app.on("window-all-closed", () => app.quit());
}

// Preload: floating fullscreen button + desktop bridge (context isolation on).
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("OPUS_DESKTOP", {
  isDesktop: true,
  toggleFullscreen: () => ipcRenderer.send("opus:toggle-fullscreen"),
});

function installButton() {
  if (!document.body || document.getElementById("opus-fs-btn")) return;
  const b = document.createElement("div");
  b.id = "opus-fs-btn";
  b.textContent = "⛶ 全屏";
  Object.assign(b.style, {
    position: "fixed",
    right: "16px",
    bottom: "16px",
    zIndex: "99999",
    padding: "9px 14px",
    borderRadius: "11px",
    background: "rgba(20,15,25,.74)",
    color: "#f7efe2",
    font: "12px ui-monospace, Menlo, monospace",
    letterSpacing: "1px",
    border: "1px solid rgba(242,180,109,.38)",
    boxShadow: "0 6px 22px rgba(0,0,0,.45)",
    cursor: "pointer",
    userSelect: "none",
    touchAction: "none",
    opacity: "0.5",
    transition: "opacity .25s ease",
    pointerEvents: "auto",
  });
  b.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    ipcRenderer.send("opus:toggle-fullscreen");
  });
  document.body.appendChild(b);

  let hideTimer = setTimeout(() => { b.style.opacity = "0.14"; }, 5000);
  const wake = () => {
    b.style.opacity = "0.88";
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { b.style.opacity = "0.14"; }, 4200);
  };
  window.addEventListener("mousemove", wake, true);
  window.addEventListener("pointerdown", wake, true);

  ipcRenderer.on("opus:fullscreen-state", (ev, fs) => {
    b.textContent = fs ? "⛶ 退出全屏" : "⛶ 全屏";
    wake();
  });
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", installButton);
} else {
  installButton();
}

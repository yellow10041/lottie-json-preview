# Lottie JSON Preview

<p align="center">
  <img src="media/icon.png" alt="Lottie JSON Preview" width="128" height="128">
</p>

<p align="center">
  <strong>Preview Lottie animations directly in VS Code</strong>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=yellow10041.lottie-json-preview">
    <img src="https://img.shields.io/visual-studio-marketplace/v/yellow10041.lottie-json-preview?style=flat-square&label=VS%20Code%20Marketplace" alt="VS Code Marketplace">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=yellow10041.lottie-json-preview">
    <img src="https://img.shields.io/visual-studio-marketplace/d/yellow10041.lottie-json-preview?style=flat-square" alt="Downloads">
  </a>
  <a href="https://github.com/yellow10041/lottie-json-preview/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/yellow10041/lottie-json-preview?style=flat-square" alt="License">
  </a>
</p>

<p align="center">
  <img src="media/demo.gif" alt="Demo" width="800">
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎬 **Auto Preview** | Opens split-view preview automatically when you open a Lottie JSON |
| ▶️ **Playback Controls** | Play, pause, and control animation speed |
| 🔁 **Loop Toggle** | Enable or disable looping |
| ⚡ **Speed Control** | Adjust speed: 0.5x, 1x, 2x |
| 🔍 **Zoom Options** | Fit to view, 100%, 150%, 200% |
| 🎨 **Background Modes** | Transparent (checkered), Light, Dark |
| 💾 **Live Reload** | Preview updates as you edit and save |

---

## 🚀 Quick Start

1. **Install** the extension from VS Code Marketplace
2. **Open** any Lottie JSON file (`.json`)
3. **Preview** opens automatically in a split view

That's it! No configuration needed.

---

## 📸 Screenshots

<p align="center">
  <img src="media/screenshot-dark.png" alt="Dark Mode" width="800">
</p>

<p align="center">
  <img src="media/screenshot-controls.png" alt="Controls" width="600">
</p>

---

## 🎮 Controls

The control bar at the bottom provides quick access to all features:

- **▶️ / ⏸** — Play or pause the animation
- **🔁** — Toggle loop on/off
- **Speed** — Select 0.5x, 1x, or 2x playback
- **Zoom** — Fit to container or scale
- **BG** — Switch background: Transparent, Light, Dark

---

## 🔧 Commands

| Command | Description |
|---------|-------------|
| `Lottie: Open Preview` | Manually open preview for current file |

Access via Command Palette: `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux)

---

## 📋 Requirements

- VS Code 1.85.0 or higher
- Works with any valid [Lottie JSON](https://lottiefiles.com/) file

---

## 🤔 FAQ

<details>
<summary><strong>Why doesn't preview open for my JSON file?</strong></summary>

The extension only opens preview for valid Lottie files. A valid Lottie JSON must have:
- `v` (version string)
- `fr` (frame rate)
- `ip` / `op` (in/out points)
- `layers` (array)

</details>

<details>
<summary><strong>Can I preview .lottie files?</strong></summary>

Currently only `.json` format is supported. Support for `.lottie` (zipped format) is planned for a future release.

</details>

<details>
<summary><strong>How do I keep the preview visible?</strong></summary>

The preview panel stays open as you switch between Lottie files. It automatically updates to show the currently active Lottie file.

</details>

---

## 📄 License

MIT © [yellow10041](https://github.com/yellow10041)

---

<p align="center">
  <strong>Made with ❤️ for the Lottie community</strong>
</p>

<p align="center">
  <a href="https://github.com/yellow10041/lottie-json-preview/issues">Report Bug</a>
  ·
  <a href="https://github.com/yellow10041/lottie-json-preview/issues">Request Feature</a>
</p>

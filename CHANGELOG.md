# Changelog

All notable changes to "Lottie JSON Preview" will be documented in this file.

## [1.0.2] - 2026-01-22

### Added
- 📊 Interactive timeline with progress bar and frame counter
- Click on timeline to seek to any position
- Speed options: 0.25x, 0.5x, 0.75x, 1x, 2x, 5x, 10x
- 🖱️ Mouse wheel zoom - scroll to zoom in/out freely
- 🖱️ Drag to pan - click and drag to move around the animation

### Fixed
- Preview now always opens in the second column
- JSON editor stays in the first column (prevents multiple column creation)
- Timeline now properly syncs with play/pause when seeking
- Progress bar moves smoothly without lag
- Fixed clickable area on timeline (frame counter no longer affects seek position)
- Fixed progress bar vertical alignment
- Settings (zoom, pan) now reset when switching files
- Smoother mouse wheel zoom
- Improved Lottie file detection (supports more file variants)

## [1.0.1] - 2026-01-21

### Changed
- Updated extension icon

## [1.0.0] - 2026-01-21

### Added
- 🎬 Auto-open preview for Lottie JSON files
- ▶️ Play/Pause controls
- 🔁 Loop toggle
- ⚡ Speed control (0.5x, 1x, 2x)
- 🔍 Zoom options (Fit, 100%, 150%, 200%)
- 🎨 Background modes (Transparent, Light, Dark)
- 💾 Live reload on file changes
- 📐 Split-view layout (JSON + Preview side by side)

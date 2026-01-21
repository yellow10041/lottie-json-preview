import { BackgroundType, SpeedType, ZoomType } from '../App';

interface ControlBarProps {
  fileName: string;
  isPlaying: boolean;
  isLooping: boolean;
  speed: SpeedType;
  zoom: ZoomType;
  background: BackgroundType;
  onPlayPause: () => void;
  onLoopToggle: () => void;
  onSpeedChange: (speed: SpeedType) => void;
  onZoomChange: (zoom: ZoomType) => void;
  onBackgroundChange: (bg: BackgroundType) => void;
}

function ControlBar({
  fileName,
  isPlaying,
  isLooping,
  speed,
  zoom,
  background,
  onPlayPause,
  onLoopToggle,
  onSpeedChange,
  onZoomChange,
  onBackgroundChange,
}: ControlBarProps) {
  const speeds: SpeedType[] = [0.5, 1, 2];
  const zooms: ZoomType[] = ['fit', 100, 150, 200];
  const backgrounds: BackgroundType[] = ['transparent', 'light', 'dark'];

  return (
    <div className="control-bar">
      <div className="control-group">
        {/* Play/Pause */}
        <button
          className={`control-btn ${isPlaying ? 'active' : ''}`}
          onClick={onPlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Loop */}
        <button
          className={`control-btn ${isLooping ? 'active' : ''}`}
          onClick={onLoopToggle}
          title={isLooping ? 'Loop: On' : 'Loop: Off'}
        >
          🔁
        </button>

        {/* Speed */}
        <div className="control-dropdown">
          <span className="control-label">Speed:</span>
          <select
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value) as SpeedType)}
          >
            {speeds.map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </div>

        {/* Zoom */}
        <div className="control-dropdown">
          <span className="control-label">Zoom:</span>
          <select
            value={zoom}
            onChange={(e) => {
              const val = e.target.value;
              onZoomChange(val === 'fit' ? 'fit' : (parseInt(val) as ZoomType));
            }}
          >
            {zooms.map((z) => (
              <option key={z} value={z}>
                {z === 'fit' ? 'Fit' : `${z}%`}
              </option>
            ))}
          </select>
        </div>

        {/* Background */}
        <div className="control-dropdown">
          <span className="control-label">BG:</span>
          <select
            value={background}
            onChange={(e) => onBackgroundChange(e.target.value as BackgroundType)}
          >
            {backgrounds.map((bg) => (
              <option key={bg} value={bg}>
                {bg.charAt(0).toUpperCase() + bg.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="file-name" title={fileName}>
        {fileName}
      </div>
    </div>
  );
}

export default ControlBar;

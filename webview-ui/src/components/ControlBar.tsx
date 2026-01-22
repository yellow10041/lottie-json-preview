import { BackgroundType, SpeedType, ZoomType, RendererType } from '../App';

interface ControlBarProps {
  fileName: string;
  isPlaying: boolean;
  isLooping: boolean;
  speed: SpeedType;
  zoom: ZoomType;
  background: BackgroundType;
  progress: number;
  totalFrames: number;
  renderer: RendererType;
  onPlayPause: () => void;
  onLoopToggle: () => void;
  onSpeedChange: (speed: SpeedType) => void;
  onZoomChange: (zoom: ZoomType) => void;
  onBackgroundChange: (bg: BackgroundType) => void;
  onRendererChange: (renderer: RendererType) => void;
  onSeek: (progress: number) => void;
}

function ControlBar({
  fileName,
  isPlaying,
  isLooping,
  speed,
  zoom,
  background,
  progress,
  totalFrames,
  renderer,
  onPlayPause,
  onLoopToggle,
  onSpeedChange,
  onZoomChange,
  onBackgroundChange,
  onRendererChange,
  onSeek,
}: ControlBarProps) {
  const speeds: SpeedType[] = [0.25, 0.5, 0.75, 1, 2, 5, 10];
  const zooms: ZoomType[] = ['fit', 100, 150, 200];
  const backgrounds: BackgroundType[] = ['transparent', 'light', 'dark'];
  const renderers: RendererType[] = ['svg', 'canvas'];

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = clickX / rect.width;
    onSeek(Math.max(0, Math.min(1, newProgress)));
  };

  const currentFrame = Math.round(progress * totalFrames);

  return (
    <div className="control-bar">
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar" onClick={handleProgressClick}>
          <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          <div className="progress-handle" style={{ left: `${progress * 100}%` }} />
        </div>
        <div className="progress-time">
          {currentFrame} / {Math.round(totalFrames)}
        </div>
      </div>

      <div className="controls-row">
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

          {/* Renderer */}
          <div className="control-dropdown">
            <span className="control-label">Render:</span>
            <select
              value={renderer}
              onChange={(e) => onRendererChange(e.target.value as RendererType)}
            >
              {renderers.map((r) => (
                <option key={r} value={r}>
                  {r.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="file-name" title={fileName}>
          {fileName}
        </div>
      </div>
    </div>
  );
}

export default ControlBar;

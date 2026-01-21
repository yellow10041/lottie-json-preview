import { useState, useEffect, useCallback } from 'react';
import LottiePlayer from './components/LottiePlayer';
import ControlBar from './components/ControlBar';

interface VSCodeMessage {
  type: string;
  content?: string;
  isValid?: boolean;
  fileName?: string;
}

// VS Code API type
declare const acquireVsCodeApi: () => {
  postMessage: (message: unknown) => void;
  getState: () => unknown;
  setState: (state: unknown) => void;
};

const vscode = acquireVsCodeApi();

export type BackgroundType = 'transparent' | 'light' | 'dark';
export type SpeedType = 0.5 | 1 | 2;
export type ZoomType = 'fit' | 100 | 150 | 200;

function App() {
  const [lottieData, setLottieData] = useState<object | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [fileName, setFileName] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(true);
  const [speed, setSpeed] = useState<SpeedType>(1);
  const [zoom, setZoom] = useState<ZoomType>('fit');
  const [background, setBackground] = useState<BackgroundType>('transparent');

  const handleMessage = useCallback((event: MessageEvent<VSCodeMessage>) => {
    const message = event.data;

    if (message.type === 'update') {
      setFileName(message.fileName || '');
      setIsValid(message.isValid || false);

      if (message.isValid && message.content) {
        try {
          const data = JSON.parse(message.content);
          setLottieData(data);
        } catch {
          setIsValid(false);
          setLottieData(null);
        }
      } else {
        setLottieData(null);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    // Notify extension that webview is ready
    vscode.postMessage({ type: 'ready' });

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  if (!isValid) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <div className="error-message">Not a valid Lottie file</div>
        <div className="error-hint">
          The file does not contain a valid Lottie animation structure.
        </div>
      </div>
    );
  }

  if (!lottieData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading animation...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className={`player-container background-${background}`}>
        <LottiePlayer
          data={lottieData}
          isPlaying={isPlaying}
          isLooping={isLooping}
          speed={speed}
          zoom={zoom}
        />
      </div>
      <ControlBar
        fileName={fileName}
        isPlaying={isPlaying}
        isLooping={isLooping}
        speed={speed}
        zoom={zoom}
        background={background}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onLoopToggle={() => setIsLooping(!isLooping)}
        onSpeedChange={setSpeed}
        onZoomChange={setZoom}
        onBackgroundChange={setBackground}
      />
    </div>
  );
}

export default App;

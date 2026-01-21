import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { SpeedType, ZoomType } from '../App';

interface LottiePlayerProps {
  data: object;
  isPlaying: boolean;
  isLooping: boolean;
  speed: SpeedType;
  zoom: ZoomType;
}

function LottiePlayer({ data, isPlaying, isLooping, speed, zoom }: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  // Initialize animation
  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy previous animation
    if (animationRef.current) {
      animationRef.current.destroy();
    }

    // Create new animation
    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: isLooping,
      autoplay: isPlaying,
      animationData: data,
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [data]);

  // Handle play/pause
  useEffect(() => {
    if (!animationRef.current) return;

    if (isPlaying) {
      animationRef.current.play();
    } else {
      animationRef.current.pause();
    }
  }, [isPlaying]);

  // Handle loop
  useEffect(() => {
    if (!animationRef.current) return;
    animationRef.current.loop = isLooping;
  }, [isLooping]);

  // Handle speed
  useEffect(() => {
    if (!animationRef.current) return;
    animationRef.current.setSpeed(speed);
  }, [speed]);

  // Calculate container style based on zoom
  const getContainerStyle = (): React.CSSProperties => {
    if (zoom === 'fit') {
      return {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
    }

    return {
      transform: `scale(${zoom / 100})`,
      transformOrigin: 'center center',
    };
  };

  return (
    <div className="lottie-player" style={getContainerStyle()}>
      <div ref={containerRef} className="lottie-container" />
    </div>
  );
}

export default LottiePlayer;

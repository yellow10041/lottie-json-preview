import { useEffect, useRef, useState, useCallback } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { SpeedType, ZoomType, RendererType } from '../App';

interface LottiePlayerProps {
  data: object;
  isPlaying: boolean;
  isLooping: boolean;
  speed: SpeedType;
  zoom: ZoomType;
  renderer: RendererType;
  onProgress?: (progress: number, totalFrames: number) => void;
  onSeekReady?: (seekFn: (progress: number, shouldPlay: boolean) => void) => void;
}

function LottiePlayer({ data, isPlaying, isLooping, speed, zoom, renderer, onProgress, onSeekReady }: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  
  // Custom zoom and pan state
  const [customScale, setCustomScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  // Reset custom zoom/pan when zoom preset, data, or renderer changes
  useEffect(() => {
    setCustomScale(1);
    setPan({ x: 0, y: 0 });
  }, [zoom, data, renderer]);

  // Initialize animation
  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy previous animation
    if (animationRef.current) {
      animationRef.current.destroy();
    }

    // Create new animation
    console.log(`[Lottie Preview] Loading animation with ${renderer} renderer`);
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: renderer,
      loop: isLooping,
      autoplay: isPlaying,
      animationData: data,
    });
    console.log(`[Lottie Preview] Animation loaded, totalFrames: ${anim.totalFrames}`);

    animationRef.current = anim;

    // Apply current speed to new animation
    anim.setSpeed(speed);

    // Set up progress tracking
    const handleEnterFrame = () => {
      if (animationRef.current) {
        const currentFrame = animationRef.current.currentFrame;
        const totalFrames = animationRef.current.totalFrames;
        onProgress?.(currentFrame / totalFrames, totalFrames);
      }
    };

    anim.addEventListener('enterFrame', handleEnterFrame);

    // Provide seek function that respects play state
    onSeekReady?.((progress: number, shouldPlay: boolean) => {
      if (animationRef.current) {
        const frame = progress * animationRef.current.totalFrames;
        if (shouldPlay) {
          animationRef.current.goToAndPlay(frame, true);
        } else {
          animationRef.current.goToAndStop(frame, true);
        }
      }
    });

    return () => {
      anim.removeEventListener('enterFrame', handleEnterFrame);
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [data, renderer]);

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

  // Handle wheel zoom (smoother with smaller delta)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.95 : 1.05;
    setCustomScale(prev => Math.min(Math.max(prev * delta, 0.1), 10));
  }, []);

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
  }, [pan]);

  // Handle drag move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({
      x: panStart.current.x + dx,
      y: panStart.current.y + dy,
    });
  }, [isDragging]);

  // Handle drag end
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Calculate base scale from zoom preset
  const getBaseScale = (): number => {
    if (zoom === 'fit') return 1;
    return zoom / 100;
  };

  // Calculate final transform
  const getTransformStyle = (): React.CSSProperties => {
    const baseScale = getBaseScale();
    const finalScale = baseScale * customScale;
    
    return {
      transform: `translate(${pan.x}px, ${pan.y}px) scale(${finalScale})`,
      transformOrigin: 'center center',
      cursor: isDragging ? 'grabbing' : 'grab',
    };
  };

  return (
    <div 
      ref={playerRef}
      className="lottie-player"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={containerRef} 
        className="lottie-container" 
        style={getTransformStyle()}
      />
    </div>
  );
}

export default LottiePlayer;

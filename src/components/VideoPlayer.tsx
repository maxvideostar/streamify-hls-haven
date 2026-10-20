
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  muted?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src,
  poster,
  title,
  autoPlay = false,
  muted = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isOffline, setIsOffline] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Setup HLS with automatic recovery (live TV: never give up, keep retrying)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;
    let mediaRecoveries = 0;

    const tryPlay = () => {
      if (!autoPlay) return;
      video.play().catch(() => {
        // Browsers block autoplay with sound: retry muted.
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => setIsPlaying(false));
      });
    };

    const scheduleRestart = () => {
      if (disposed || retryTimer) return;
      setIsOffline(true);
      retryTimer = setTimeout(() => {
        retryTimer = null;
        start();
      }, 5000);
    };

    const start = () => {
      if (disposed) return;
      hls?.destroy();
      hls = null;

      if (Hls.isSupported()) {
        hls = new Hls({
          startLevel: -1,
          enableWorker: true,
          lowLatencyMode: true,
          liveSyncDurationCount: 3,
          manifestLoadingMaxRetry: 4,
          levelLoadingMaxRetry: 4,
          fragLoadingMaxRetry: 6,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsOffline(false);
          mediaRecoveries = 0;
          tryPlay();
        });
        hls.on(Hls.Events.FRAG_LOADED, () => setIsOffline(false));
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (!data.fatal) return;
          console.warn('HLS fatal error:', data.type, data.details);
          if (data.type === Hls.ErrorTypes.MEDIA_ERROR && mediaRecoveries < 3) {
            mediaRecoveries++;
            hls?.recoverMediaError();
          } else {
            scheduleRestart();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS (Safari / iOS)
        video.src = src;
        video.onerror = scheduleRestart;
        video.onloadedmetadata = () => setIsOffline(false);
        tryPlay();
      }
    };

    start();

    return () => {
      disposed = true;
      if (retryTimer) clearTimeout(retryTimer);
      video.onerror = null;
      video.onloadedmetadata = null;
      hls?.destroy();
    };
  }, [src, autoPlay]);

  // Handle play/pause
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          console.error('Play prevented:', err);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle mute/unmute and volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  // Setup event listeners
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement) return;
    
    const onTimeUpdate = () => {
      if (videoElement.duration) {
        setProgress((videoElement.currentTime / videoElement.duration) * 100);
        setCurrentTime(videoElement.currentTime);
      }
    };
    
    const onLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };
    
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => {
      setVolume(videoElement.volume);
      setIsMuted(videoElement.muted);
    };
    
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    videoElement.addEventListener('timeupdate', onTimeUpdate);
    videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
    videoElement.addEventListener('play', onPlay);
    videoElement.addEventListener('pause', onPause);
    videoElement.addEventListener('volumechange', onVolumeChange);
    videoElement.addEventListener('waiting', onWaiting);
    videoElement.addEventListener('playing', onPlaying);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    
    return () => {
      videoElement.removeEventListener('timeupdate', onTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
      videoElement.removeEventListener('play', onPlay);
      videoElement.removeEventListener('pause', onPause);
      videoElement.removeEventListener('volumechange', onVolumeChange);
      videoElement.removeEventListener('waiting', onWaiting);
      videoElement.removeEventListener('playing', onPlaying);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  // Handle mouse movement for controls visibility
  const showControls = () => {
    setIsControlsVisible(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 3000);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const isLive = !Number.isFinite(duration) || duration === 0;

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full">
      <div 
        ref={containerRef}
        className={cn(
          "relative w-full video-container bg-black rounded-lg overflow-hidden shadow-xl",
          isFullscreen ? "fixed inset-0 z-50" : "aspect-video"
        )}
        onMouseMove={showControls}
        onMouseLeave={() => setIsControlsVisible(false)}
      >
        <video
          ref={videoRef}
          poster={poster}
          className="w-full h-full object-contain"
          playsInline
          onClick={() => setIsPlaying(!isPlaying)}
        />
        
        {/* Buffering indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Offline / reconnecting */}
        {isOffline && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 text-white text-sm">
            <div className="w-10 h-10 border-4 border-white/60 border-t-transparent rounded-full animate-spin" />
            Semnal indisponibil — reconectare…
          </div>
        )}

        {/* Back button (only in fullscreen) */}
        {isFullscreen && (
          <button
            className={cn(
              "absolute top-4 left-4 p-2 rounded-full bg-black/50 text-white transition-opacity duration-300 hover:bg-black/70",
              isControlsVisible ? "opacity-100" : "opacity-0"
            )}
            onClick={() => {
              document.exitFullscreen();
              navigate(-1);
            }}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        {/* Video controls */}
        <div 
          className={cn(
            "video-controls transition-opacity duration-300",
            isControlsVisible || !isPlaying ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Progress bar (VOD only) */}
          {!isLive && <div 
            ref={progressRef}
            className="video-progress mb-3"
            onClick={handleProgressClick}
          >
            <div 
              className="video-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>}
          
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              {/* Play/Pause button */}
              <button 
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              {/* Volume control */}
              <div className="flex items-center space-x-2">
                <button 
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    setIsMuted(newVolume === 0);
                  }}
                  className="w-16 md:w-24 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                />
              </div>
              
              {/* Live badge / time display */}
              {isLive ? (
                <div className="live-indicator">LIVE</div>
              ) : (
                <div className="text-xs md:text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration || 0)}
                </div>
              )}
            </div>
            
            {/* Right controls */}
            <div className="flex items-center space-x-3">
              {/* Fullscreen button */}
              <button 
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                onClick={toggleFullscreen}
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default VideoPlayer;

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import type { Track } from '../types/music';
import { cn } from '../lib/utils';

interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  formatTime: (seconds: number) => string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  formatTime,
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onSeek(percentage * duration);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 z-40"
    >
      <div className="max-w-7xl mx-auto">
        {currentTrack ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-white/10 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{currentTrack.title}</h3>
                  <p className="text-white/60 text-sm truncate">{currentTrack.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="text-white/60 hover:text-white transition-colors">
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onPlayPause}
                  className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </motion.button>
                
                <button className="text-white/60 hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-1 justify-end">
                <Volume2 className="w-5 h-5 text-white/60" />
                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-cyan-500 to-blue-500" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-white/60 w-12 text-right">
                {formatTime(currentTime)}
              </span>
              
              <div
                className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 relative transition-all group-hover:h-3"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              
              <span className="text-xs text-white/60 w-12">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center text-white/40 py-4">
            <p>No track playing</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

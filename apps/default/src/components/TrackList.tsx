import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Headphones } from 'lucide-react';
import type { Track } from '../types/music';
import { cn } from '../lib/utils';

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
}

const genreColors: Record<string, string> = {
  pop: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  rock: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  jazz: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  electronic: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  hiphop: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  classical: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  indie: 'bg-green-500/20 text-green-400 border-green-500/30',
  ambient: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
};

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
}) => {
  return (
    <div className="space-y-2">
      {tracks.map((track, index) => {
        const isActive = currentTrack?.id === track.id;
        const isCurrentlyPlaying = isActive && isPlaying;

        return (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'p-4 rounded-xl border transition-all cursor-pointer group',
              isActive
                ? 'bg-cyan-500/10 border-cyan-500/30 shadow-lg shadow-cyan-500/20'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            )}
            onClick={() => onPlayTrack(track)}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center transition-all',
                    isActive
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600'
                      : 'bg-white/5 group-hover:bg-white/10'
                  )}
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </div>
                {isCurrentlyPlaying && (
                  <div className="absolute -right-1 -top-1">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  'font-semibold truncate',
                  isActive ? 'text-white' : 'text-white/90'
                )}>
                  {track.title}
                </h3>
                <p className="text-white/60 text-sm truncate">{track.artist}</p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium border',
                    genreColors[track.genre] || 'bg-white/5 text-white/60 border-white/10'
                  )}
                >
                  {track.genre}
                </span>
                
                <div className="flex items-center gap-1.5 text-white/60">
                  <Headphones className="w-4 h-4" />
                  <span className="text-sm">{track.playCount.toLocaleString()}</span>
                </div>
                
                <span className="text-white/60 text-sm w-12 text-right">
                  {track.duration}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

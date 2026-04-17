import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music2, Library, Upload } from 'lucide-react';
import { MusicPlayer } from './components/MusicPlayer';
import { TrackList } from './components/TrackList';
import { UploadForm } from './components/UploadForm';
import { ChatWidget } from './components/ChatWidget';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { musicApi } from './services/api';
import type { Track } from './types/music';
import { cn } from './lib/utils';

type Tab = 'library' | 'upload';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('library');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    playTrack,
    pause,
    seek,
    formatTime,
  } = useAudioPlayer();

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      const fetchedTracks = await musicApi.getTracks();
      setTracks(fetchedTracks);
    } catch (error) {
      console.error('Failed to load tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayTrack = async (track: Track) => {
    playTrack(track);
    
    if (currentTrack?.id !== track.id) {
      try {
        await musicApi.incrementPlayCount(track.id, track.playCount);
        setTracks(prev =>
          prev.map(t =>
            t.id === track.id ? { ...t, playCount: t.playCount + 1 } : t
          )
        );
      } catch (error) {
        console.error('Failed to update play count:', error);
      }
    }
  };

  const handlePlayPause = () => {
    if (currentTrack) {
      if (isPlaying) {
        pause();
      } else {
        playTrack(currentTrack);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pb-32">
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-b border-white/10 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <Music2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Primavibe
                </h1>
                <p className="text-xs text-white/60">Discover your sound</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setActiveTab('library')}
                className={cn(
                  'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
                  activeTab === 'library'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                    : 'text-white/60 hover:text-white'
                )}
              >
                <Library className="w-4 h-4" />
                <span className="font-medium">Library</span>
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={cn(
                  'px-4 py-2 rounded-lg flex items-center gap-2 transition-all',
                  activeTab === 'upload'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                    : 'text-white/60 hover:text-white'
                )}
              >
                <Upload className="w-4 h-4" />
                <span className="font-medium">Upload</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-28 px-6 max-w-7xl mx-auto">
        {activeTab === 'library' && (
          <motion.div
            key="library"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Your Music Library</h2>
              <p className="text-white/60">
                {tracks.length} tracks available • {currentTrack ? 'Now playing' : 'Ready to play'}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-white/60 mt-4">Loading your library...</p>
              </div>
            ) : (
              <TrackList
                tracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
              />
            )}
          </motion.div>
        )}

        {activeTab === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Upload Studio</h2>
              <p className="text-white/60">Share your creations with the community</p>
            </div>

            <UploadForm />
          </motion.div>
        )}
      </div>

      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={handlePlayPause}
        onSeek={seek}
        formatTime={formatTime}
      />

      <ChatWidget />
    </div>
  );
};

export default App;

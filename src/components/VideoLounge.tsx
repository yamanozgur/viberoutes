import React, { useState } from 'react';
import { AMBIENT_VIDEOS } from '../data/curatedRoutes';
import { AmbientVideo } from '../types';
import { Play, Pause, Volume2, VolumeX, Camera, Film, Sparkles, MapPin } from 'lucide-react';
import { ambientAudio } from '../utils/audio';

export const VideoLounge: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<AmbientVideo>(AMBIENT_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleSound = () => {
    if (isAudioOn) {
      ambientAudio.stop();
      setIsAudioOn(false);
    } else {
      ambientAudio.play('rain');
      setIsAudioOn(true);
    }
  };

  return (
    <div className="bg-[#FAFAF7] min-h-screen py-10 px-4 sm:px-8 text-[#2D2924]">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-3 border-b border-[#E5E0D8] pb-6">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.25em] font-ui text-[#767064] font-medium">
            <Film className="w-3.5 h-3.5 text-[#9E7B54]" />
            <span>Silent Cinematic Travel Series · 4–8 Min Atmospheric Cinema</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-[#1A1814]">
            Silent Travel Cinema
          </h1>
          <p className="font-display text-lg italic text-[#9E7B54] font-light max-w-2xl">
            No voiceover, no narrative soundtrack—only pure 32-bit float layered ambient sound design and Japanese documentary-style cinematography on Lumix S9.
          </p>
        </div>

        {/* Cinema Stage */}
        <div className="bg-[#1A1814] text-[#FAF8F5] border border-[#E5E0D8] overflow-hidden shadow-2xl">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-[#131210] flex items-center justify-center overflow-hidden">
            <img
              src={activeVideo.thumbnailUrl}
              alt={activeVideo.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-all duration-1000 ${
                isPlaying ? 'scale-105 filter brightness-95' : 'brightness-75'
              }`}
            />

            {/* Video overlay controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#131210] via-transparent to-black/40 flex flex-col justify-between p-6 sm:p-8">
              <div className="flex justify-between items-center text-xs font-ui tracking-widest uppercase">
                <span className="bg-[#131210]/90 backdrop-blur-xs px-3 py-1 border border-[#2A2722] text-[#FAF8F5]">
                  {activeVideo.camera}
                </span>
                <span className="text-[#C8A97E]">{activeVideo.duration}</span>
              </div>

              <div className="flex items-center justify-center">
                <button
                  onClick={togglePlayback}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] text-[#131210] flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  title={isPlaying ? 'Pause film' : 'Play film'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-ui text-[#C8A97E] uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {activeVideo.location}, {activeVideo.country}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-light text-[#FAF8F5] mt-1">
                    {activeVideo.title}
                  </h2>
                </div>

                <button
                  onClick={toggleSound}
                  className="inline-flex items-center space-x-2 bg-[#1F1D19]/90 backdrop-blur-xs border border-[#333029] px-4 py-2 text-xs font-ui text-[#FAF8F5] hover:bg-[#FAF8F5] hover:text-[#131210] transition-colors cursor-pointer"
                >
                  {isAudioOn ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#C8A97E] animate-pulse" />
                      <span>Natural Audio: Active</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-[#8C867B]" />
                      <span>Toggle Sound Design</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sound & Camera Meta Bar */}
          <div className="bg-[#181715] p-6 sm:p-8 border-t border-[#2A2722] grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-ui text-[#CBC5B9]">
            <div>
              <span className="text-[#8C867B] uppercase tracking-wider block mb-1">Acoustic Sound Design:</span>
              <p className="text-[#FAF8F5] font-light italic">"{activeVideo.soundType}"</p>
            </div>
            <div>
              <span className="text-[#8C867B] uppercase tracking-wider block mb-1">Observation Notes:</span>
              <p className="text-[#CBC5B9] font-light leading-relaxed">{activeVideo.description}</p>
            </div>
          </div>
        </div>

        {/* Video Playlist Grid */}
        <div className="space-y-4 pt-6">
          <h3 className="font-display text-2xl font-light text-[#1A1814]">
            Archive of Silent Travel Shorts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {AMBIENT_VIDEOS.map((vid) => (
              <div
                key={vid.id}
                onClick={() => {
                  setActiveVideo(vid);
                  setIsPlaying(true);
                }}
                className={`border p-4 transition-all cursor-pointer shadow-xs ${
                  activeVideo.id === vid.id
                    ? 'border-[#9E7B54] bg-[#FFFFFF] shadow-sm'
                    : 'border-[#E5E0D8] bg-[#FFFFFF] hover:border-[#C4BCAD]'
                }`}
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#EBE5DC] relative mb-3">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/80 text-[#FAF8F5] text-[10px] px-1.5 py-0.5 font-ui">
                    {vid.duration}
                  </span>
                </div>
                <span className="text-[10px] font-ui uppercase tracking-wider text-[#767064] block">
                  {vid.country} · {vid.category}
                </span>
                <h4 className="font-display text-lg font-light text-[#1A1814] mt-1 leading-snug">
                  {vid.title}
                </h4>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Waves, 
  Wind, 
  Radio, 
  Sparkles, 
  Music, 
  X, 
  Check, 
  Headphones,
  Sliders
} from 'lucide-react';
import { ThemeConfig } from '../theme/themeConfig';
import { SoundType, SoundPreset } from '../types';
import { AudioVisualizer } from './AudioVisualizer';

interface SoundscapesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  activeSound: SoundType;
  volume: number;
  customStreamUrl?: string;
  onSelectSound: (sound: SoundType) => void;
  onVolumeChange: (volume: number) => void;
  onCustomStreamChange: (url: string) => void;
}

const SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'none',
    name: 'Mute / Silence',
    description: 'Zero audio distraction, pure focus',
    iconName: 'VolumeX',
    isProcedural: false,
  },
  {
    id: 'brownNoise',
    name: 'Deep Brown Noise',
    description: 'Low-frequency acoustic blanket for ADHD & intense flow',
    iconName: 'Wind',
    isProcedural: true,
  },
  {
    id: 'pinkNoise',
    name: 'Pink Noise (1/f)',
    description: 'Synchronizes slow-wave brain rhythms for sustained recall',
    iconName: 'Radio',
    isProcedural: true,
  },
  {
    id: 'rain',
    name: 'Gentle Rain & Drops',
    description: 'Soothing rainfall on a quiet study window',
    iconName: 'CloudRain',
    isProcedural: true,
  },
  {
    id: 'ocean',
    name: 'Ocean Tide Waves',
    description: '8-second natural breathing rhythm of rolling tides',
    iconName: 'Waves',
    isProcedural: true,
  },
  {
    id: 'stream',
    name: 'Mountain Forest Stream',
    description: 'Trickling crystal clear alpine water',
    iconName: 'Sparkles',
    isProcedural: true,
  },
  {
    id: 'tibetanBowl',
    name: '432Hz Tibetan Bowl Drone',
    description: 'Harmonic theta-wave drone for tranquil meditation & reading',
    iconName: 'Headphones',
    isProcedural: true,
  },
  {
    id: 'ncsLofi',
    name: 'NCS & Lofi Relax Beats',
    description: 'Copyright-free chill study stream for effortless flow',
    iconName: 'Music',
    isProcedural: false,
  },
];

export const SoundscapesDrawer: React.FC<SoundscapesDrawerProps> = ({
  isOpen,
  onClose,
  theme,
  activeSound,
  volume,
  customStreamUrl,
  onSelectSound,
  onVolumeChange,
  onCustomStreamChange,
}) => {
  const [streamInput, setStreamInput] = useState(customStreamUrl || '');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!isOpen) return null;

  const getIcon = (iconName: string, isSelected: boolean) => {
    const size = 18;
    switch (iconName) {
      case 'VolumeX':
        return <VolumeX size={size} />;
      case 'Wind':
        return <Wind size={size} />;
      case 'Radio':
        return <Radio size={size} />;
      case 'CloudRain':
        return <CloudRain size={size} />;
      case 'Waves':
        return <Waves size={size} />;
      case 'Sparkles':
        return <Sparkles size={size} />;
      case 'Headphones':
        return <Headphones size={size} />;
      case 'Music':
        return <Music size={size} />;
      default:
        return <Volume2 size={size} />;
    }
  };

  const handleSaveCustomStream = (e: React.FormEvent) => {
    e.preventDefault();
    onCustomStreamChange(streamInput.trim());
    if (activeSound === 'ncsLofi') {
      onSelectSound('ncsLofi');
    }
    setShowCustomInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className={`w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-[36px] sm:rounded-[36px] p-6 shadow-2xl border ${theme.cardBg} ${theme.cardBorder}`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-2xl ${theme.accentBg}`}>
              <Headphones size={20} style={{ color: theme.waveColor }} />
            </div>
            <div>
              <h2 className={`text-lg font-black tracking-tight ${theme.textColor}`}>
                Soundscapes Studio
              </h2>
              <p className={`text-xs ${theme.textMuted} font-medium`}>
                Procedural biophilic audio & NCS chill streams
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 hover:opacity-70 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Live Audio Visualizer Banner */}
        <div className="rounded-3xl p-4 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner"
              style={{ backgroundColor: activeSound !== 'none' ? `${theme.waveColor}25` : 'rgba(0,0,0,0.05)' }}
            >
              {activeSound !== 'none' ? (
                <Volume2 size={18} style={{ color: theme.waveColor }} />
              ) : (
                <VolumeX size={18} className="opacity-50" />
              )}
            </div>
            <div>
              <p className={`text-xs font-bold ${theme.textColor}`}>
                {activeSound !== 'none'
                  ? SOUND_PRESETS.find((s) => s.id === activeSound)?.name
                  : 'Sound is muted'}
              </p>
              <p className={`text-[10px] ${theme.textMuted} font-medium`}>
                {activeSound !== 'none' ? 'Procedurally synthesised • 0% copyright' : 'Tap a sound below to play'}
              </p>
            </div>
          </div>

          <AudioVisualizer isPlaying={activeSound !== 'none'} color={theme.waveColor} barCount={12} />
        </div>

        {/* Master Volume Slider */}
        <div className="mb-5 px-2">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className={theme.textMuted}>Master Volume</span>
            <span className={theme.textColor}>{Math.round(volume * 100)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <VolumeX size={14} className="opacity-50" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 appearance-none cursor-pointer accent-[#C86246]"
            />
            <Volume2 size={14} className="opacity-50" />
          </div>
        </div>

        {/* Sound Selection Grid */}
        <div className="space-y-2.5 mb-5">
          {SOUND_PRESETS.map((preset) => {
            const isSelected = activeSound === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => onSelectSound(preset.id)}
                className={`group p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? `${theme.cardBorder} shadow-sm ring-2 ring-black/10 dark:ring-white/10 bg-black/5 dark:bg-white/10`
                    : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isSelected ? `${theme.primary} ${theme.primaryText}` : 'bg-black/5 dark:bg-white/10 text-muted-foreground'
                    }`}
                  >
                    {getIcon(preset.iconName, isSelected)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs sm:text-sm font-extrabold ${theme.textColor}`}>
                        {preset.name}
                      </h4>
                      {preset.isProcedural && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 opacity-70">
                          SYNTH
                        </span>
                      )}
                      {preset.id === 'ncsLofi' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 font-mono">
                          NCS FREE
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] ${theme.textMuted} line-clamp-1`}>
                      {preset.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center bg-emerald-500 text-white">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Stream Configuration Button & Form */}
        <div className="pt-2 border-t border-black/5 dark:border-white/10">
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-all py-1.5"
          >
            <Sliders size={13} />
            <span>{showCustomInput ? 'Hide custom stream URL' : 'Use custom NCS/Radio stream link'}</span>
          </button>

          {showCustomInput && (
            <form onSubmit={handleSaveCustomStream} className="mt-2 space-y-2">
              <input
                type="url"
                placeholder="Paste direct audio stream URL (MP3/AAC)..."
                value={streamInput}
                onChange={(e) => setStreamInput(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs border bg-black/5 dark:bg-white/10 ${theme.cardBorder} outline-none ${theme.textColor}`}
              />
              <button
                type="submit"
                className={`w-full py-2 rounded-xl text-xs font-bold ${theme.primary} ${theme.primaryText}`}
              >
                Apply Custom Stream
              </button>
            </form>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-2xl text-xs font-black tracking-wide ${theme.primary} ${theme.primaryText} hover:scale-102 active:scale-98 transition-all shadow-md`}
          >
            Close Soundscapes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

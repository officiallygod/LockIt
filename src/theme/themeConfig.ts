import { ThemeId } from '../types';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bg: string;
  cardBg: string;
  cardBorder: string;
  primary: string;
  primaryHover: string;
  primaryText: string;
  accent: string;
  accentBg: string;
  textColor: string;
  textMuted: string;
  timerBg: string;
  waveColor: string;
  pillBg: string;
  pillText: string;
  dotColor: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  terracotta: {
    id: 'terracotta',
    name: 'Clay & Cream (Minimal)',
    bg: 'bg-[#FAF6F0]',
    cardBg: 'bg-[#F2EAE0]',
    cardBorder: 'border-[#E6DACB]',
    primary: 'bg-[#C86246]',
    primaryHover: 'hover:bg-[#B55338]',
    primaryText: 'text-white',
    accent: 'text-[#C86246]',
    accentBg: 'bg-[#C86246]/10',
    textColor: 'text-[#231F1D]',
    textMuted: 'text-[#8A827A]',
    timerBg: 'bg-[#FAF6F0]',
    waveColor: '#C86246',
    pillBg: 'bg-[#1C1A19]',
    pillText: 'text-white',
    dotColor: '#C86246',
  },
  pastel: {
    id: 'pastel',
    name: 'Pastel Campus (Joyful)',
    bg: 'bg-[#F5F4FD]',
    cardBg: 'bg-[#FFFFFF]',
    cardBorder: 'border-[#EAE7FA]',
    primary: 'bg-[#FFC93C]',
    primaryHover: 'hover:bg-[#EDB424]',
    primaryText: 'text-[#1A1824]',
    accent: 'text-[#7F5AF0]',
    accentBg: 'bg-[#7F5AF0]/10',
    textColor: 'text-[#1B1926]',
    textMuted: 'text-[#7D7A8F]',
    timerBg: 'bg-[#FFFFFF]',
    waveColor: '#7F5AF0',
    pillBg: 'bg-[#1B1926]',
    pillText: 'text-white',
    dotColor: '#FFC93C',
  },
  violet: {
    id: 'violet',
    name: 'Liquid Violet & Coral (Immersive)',
    bg: 'bg-[#3F2B7B]',
    cardBg: 'bg-[#4B3494]',
    cardBorder: 'border-[#5B41B0]',
    primary: 'bg-[#FA5246]',
    primaryHover: 'hover:bg-[#E53E32]',
    primaryText: 'text-white',
    accent: 'text-[#FA5246]',
    accentBg: 'bg-[#FA5246]/20',
    textColor: 'text-[#FFFFFF]',
    textMuted: 'text-[#DDD6FE]',
    timerBg: 'bg-[#37236F]',
    waveColor: '#FA5246',
    pillBg: 'bg-[#FA5246]',
    pillText: 'text-white',
    dotColor: '#FA5246',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Zen (OLED Dark)',
    bg: 'bg-[#0E1015]',
    cardBg: 'bg-[#161922]',
    cardBorder: 'border-[#232736]',
    primary: 'bg-[#F59E0B]',
    primaryHover: 'hover:bg-[#D97706]',
    primaryText: 'text-[#0E1015]',
    accent: 'text-[#F59E0B]',
    accentBg: 'bg-[#F59E0B]/15',
    textColor: 'text-[#F3F4F6]',
    textMuted: 'text-[#9CA3AF]',
    timerBg: 'bg-[#161922]',
    waveColor: '#F59E0B',
    pillBg: 'bg-[#F59E0B]',
    pillText: 'text-[#0E1015]',
    dotColor: '#10B981',
  },
};

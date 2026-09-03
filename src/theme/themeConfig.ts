import { ThemeId } from '../types';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  isDark: boolean;
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
  blobColors: [string, string, string]; // For abstract background and organic shapes
}

export const getThemeConfig = (themeId: ThemeId, isDark: boolean): ThemeConfig => {
  switch (themeId) {
    case 'terracotta':
      if (isDark) {
        return {
          id: 'terracotta',
          name: 'Terracotta & Clay (Dark)',
          isDark: true,
          bg: 'bg-[#161312]',
          cardBg: 'bg-[#201C1A]/90',
          cardBorder: 'border-[#332D29]',
          primary: 'bg-[#E07A5F]',
          primaryHover: 'hover:bg-[#C86246]',
          primaryText: 'text-[#161312]',
          accent: 'text-[#E07A5F]',
          accentBg: 'bg-[#E07A5F]/20',
          textColor: 'text-[#FAF6F0]',
          textMuted: 'text-[#A89D95]',
          timerBg: 'bg-[#201C1A]',
          waveColor: '#E07A5F',
          pillBg: 'bg-[#E07A5F]',
          pillText: 'text-[#161312]',
          dotColor: '#E07A5F',
          blobColors: ['#E07A5F', '#9C442B', '#2D201A'],
        };
      }
      return {
        id: 'terracotta',
        name: 'Terracotta & Cream (Light)',
        isDark: false,
        bg: 'bg-[#FAF6F0]',
        cardBg: 'bg-[#FFFFFF]/90',
        cardBorder: 'border-[#EFE7DC]',
        primary: 'bg-[#C86246]',
        primaryHover: 'hover:bg-[#B3553C]',
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
        blobColors: ['#E07A5F', '#F4A261', '#E76F51'],
      };

    case 'pastel':
      if (isDark) {
        return {
          id: 'pastel',
          name: 'Pastel Campus (Dark)',
          isDark: true,
          bg: 'bg-[#12111A]',
          cardBg: 'bg-[#1C1A29]/90',
          cardBorder: 'border-[#2C283F]',
          primary: 'bg-[#FFC93C]',
          primaryHover: 'hover:bg-[#EDB424]',
          primaryText: 'text-[#12111A]',
          accent: 'text-[#A799FF]',
          accentBg: 'bg-[#A799FF]/20',
          textColor: 'text-[#F5F4FD]',
          textMuted: 'text-[#9D97B5]',
          timerBg: 'bg-[#1C1A29]',
          waveColor: '#A799FF',
          pillBg: 'bg-[#FFC93C]',
          pillText: 'text-[#12111A]',
          dotColor: '#FFC93C',
          blobColors: ['#7F5AF0', '#FFC93C', '#2CB67D'],
        };
      }
      return {
        id: 'pastel',
        name: 'Pastel Campus (Light)',
        isDark: false,
        bg: 'bg-[#F6F5FD]',
        cardBg: 'bg-[#FFFFFF]/90',
        cardBorder: 'border-[#E8E5FA]',
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
        blobColors: ['#9381FF', '#FFD166', '#B8C0FF'],
      };

    case 'violet':
      if (isDark) {
        return {
          id: 'violet',
          name: 'Liquid Violet & Coral (Night)',
          isDark: true,
          bg: 'bg-[#211442]',
          cardBg: 'bg-[#2E1C5C]/90',
          cardBorder: 'border-[#432985]',
          primary: 'bg-[#FA5246]',
          primaryHover: 'hover:bg-[#E53E32]',
          primaryText: 'text-white',
          accent: 'text-[#FA5246]',
          accentBg: 'bg-[#FA5246]/25',
          textColor: 'text-[#FFFFFF]',
          textMuted: 'text-[#DDD6FE]',
          timerBg: 'bg-[#2A1954]',
          waveColor: '#FA5246',
          pillBg: 'bg-[#FA5246]',
          pillText: 'text-white',
          dotColor: '#FA5246',
          blobColors: ['#FA5246', '#7000FF', '#FF7A00'],
        };
      }
      return {
        id: 'violet',
        name: 'Liquid Violet & Coral (Day)',
        isDark: false,
        bg: 'bg-[#F9F7FE]',
        cardBg: 'bg-[#FFFFFF]/90',
        cardBorder: 'border-[#EBE4FC]',
        primary: 'bg-[#FA5246]',
        primaryHover: 'hover:bg-[#E53E32]',
        primaryText: 'text-white',
        accent: 'text-[#5035A4]',
        accentBg: 'bg-[#5035A4]/10',
        textColor: 'text-[#241747]',
        textMuted: 'text-[#73639C]',
        timerBg: 'bg-[#FFFFFF]',
        waveColor: '#5035A4',
        pillBg: 'bg-[#241747]',
        pillText: 'text-white',
        dotColor: '#FA5246',
        blobColors: ['#6C4AB6', '#FA5246', '#8D72E1'],
      };

    case 'midnight':
    default:
      if (isDark) {
        return {
          id: 'midnight',
          name: 'Midnight Zen (OLED Dark)',
          isDark: true,
          bg: 'bg-[#08090C]',
          cardBg: 'bg-[#10131A]/90',
          cardBorder: 'border-[#1C222E]',
          primary: 'bg-[#F59E0B]',
          primaryHover: 'hover:bg-[#D97706]',
          primaryText: 'text-[#08090C]',
          accent: 'text-[#F59E0B]',
          accentBg: 'bg-[#F59E0B]/20',
          textColor: 'text-[#F3F4F6]',
          textMuted: 'text-[#94A3B8]',
          timerBg: 'bg-[#10131A]',
          waveColor: '#F59E0B',
          pillBg: 'bg-[#F59E0B]',
          pillText: 'text-[#08090C]',
          dotColor: '#10B981',
          blobColors: ['#F59E0B', '#10B981', '#3B82F6'],
        };
      }
      return {
        id: 'midnight',
        name: 'Modern Slate (Light)',
        isDark: false,
        bg: 'bg-[#F1F3F7]',
        cardBg: 'bg-[#FFFFFF]/90',
        cardBorder: 'border-[#E1E5EC]',
        primary: 'bg-[#1E2430]',
        primaryHover: 'hover:bg-[#111620]',
        primaryText: 'text-white',
        accent: 'text-[#1E2430]',
        accentBg: 'bg-[#1E2430]/10',
        textColor: 'text-[#0F141C]',
        textMuted: 'text-[#627084]',
        timerBg: 'bg-[#FFFFFF]',
        waveColor: '#1E2430',
        pillBg: 'bg-[#1E2430]',
        pillText: 'text-white',
        dotColor: '#10B981',
        blobColors: ['#94A3B8', '#CBD5E1', '#64748B'],
      };
  }
};

// Legacy lookup dictionary for backward compatibility
export const THEMES: Record<ThemeId, ThemeConfig> = {
  terracotta: getThemeConfig('terracotta', false),
  pastel: getThemeConfig('pastel', false),
  violet: getThemeConfig('violet', false),
  midnight: getThemeConfig('midnight', true),
};

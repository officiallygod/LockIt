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
  blobColors: [string, string, string];
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
          cardBg: 'bg-[#201C1A]',
          cardBorder: 'border-[#423934]',
          primary: 'bg-[#E07A5F]',
          primaryHover: 'hover:bg-[#C86246]',
          primaryText: 'text-white',
          accent: 'text-[#E07A5F]',
          accentBg: 'bg-[#E07A5F]/20',
          textColor: 'text-[#FAF6F0]',
          textMuted: 'text-[#DDD4CE]',
          timerBg: 'bg-[#201C1A]',
          waveColor: '#E07A5F',
          pillBg: 'bg-[#E07A5F]',
          pillText: 'text-white',
          dotColor: '#E07A5F',
          blobColors: ['#E07A5F', '#9C442B', '#2D201A'],
        };
      }
      return {
        id: 'terracotta',
        name: 'Terracotta & Cream (Light)',
        isDark: false,
        bg: 'bg-[#FAF6F0]',
        cardBg: 'bg-[#FFFFFF]',
        cardBorder: 'border-[#D9CFC4]',
        primary: 'bg-[#C86246]',
        primaryHover: 'hover:bg-[#B3553C]',
        primaryText: 'text-white',
        accent: 'text-[#C86246]',
        accentBg: 'bg-[#C86246]/10',
        textColor: 'text-[#1F1B19]',
        textMuted: 'text-[#4D453E]',
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
          cardBg: 'bg-[#1C1A29]',
          cardBorder: 'border-[#38334E]',
          primary: 'bg-[#FFC93C]',
          primaryHover: 'hover:bg-[#EDB424]',
          primaryText: 'text-[#12111A]',
          accent: 'text-[#A799FF]',
          accentBg: 'bg-[#A799FF]/20',
          textColor: 'text-[#FFFFFF]',
          textMuted: 'text-[#D5D0EA]',
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
        cardBg: 'bg-[#FFFFFF]',
        cardBorder: 'border-[#D5D0F0]',
        primary: 'bg-[#FFC93C]',
        primaryHover: 'hover:bg-[#EDB424]',
        primaryText: 'text-[#1A1824]',
        accent: 'text-[#7F5AF0]',
        accentBg: 'bg-[#7F5AF0]/10',
        textColor: 'text-[#15131F]',
        textMuted: 'text-[#444059]',
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
          cardBg: 'bg-[#2E1C5C]',
          cardBorder: 'border-[#5536A3]',
          primary: 'bg-[#FA5246]',
          primaryHover: 'hover:bg-[#E53E32]',
          primaryText: 'text-white',
          accent: 'text-[#FA5246]',
          accentBg: 'bg-[#FA5246]/25',
          textColor: 'text-[#FFFFFF]',
          textMuted: 'text-[#E2DCF7]',
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
        cardBg: 'bg-[#FFFFFF]',
        cardBorder: 'border-[#D9CCF7]',
        primary: 'bg-[#FA5246]',
        primaryHover: 'hover:bg-[#E53E32]',
        primaryText: 'text-white',
        accent: 'text-[#4E3696]',
        accentBg: 'bg-[#4E3696]/10',
        textColor: 'text-[#19112F]',
        textMuted: 'text-[#443763]',
        timerBg: 'bg-[#4E3696]',
        waveColor: '#4E3696',
        pillBg: 'bg-[#4E3696]',
        pillText: 'text-white',
        dotColor: '#FA5246',
        blobColors: ['#4E3696', '#FA5246', '#F8C8BA'],
      };

    case 'midnight':
      if (isDark) {
        return {
          id: 'midnight',
          name: 'Midnight Bioluminescence',
          isDark: true,
          bg: 'bg-[#0B0F19]',
          cardBg: 'bg-[#111827]',
          cardBorder: 'border-[#26354D]',
          primary: 'bg-[#06B6D4]',
          primaryHover: 'hover:bg-[#0891B2]',
          primaryText: 'text-[#0B0F19]',
          accent: 'text-[#06B6D4]',
          accentBg: 'bg-[#06B6D4]/20',
          textColor: 'text-[#F9FAFB]',
          textMuted: 'text-[#CBD5E1]',
          timerBg: 'bg-[#111827]',
          waveColor: '#06B6D4',
          pillBg: 'bg-[#06B6D4]',
          pillText: 'text-[#0B0F19]',
          dotColor: '#06B6D4',
          blobColors: ['#06B6D4', '#3B82F6', '#1E1B4B'],
        };
      }
      return {
        id: 'midnight',
        name: 'Glacier Daylight',
        isDark: false,
        bg: 'bg-[#F0F9FF]',
        cardBg: 'bg-[#FFFFFF]',
        cardBorder: 'border-[#BAE6FD]',
        primary: 'bg-[#0284C7]',
        primaryHover: 'hover:bg-[#0369A1]',
        primaryText: 'text-white',
        accent: 'text-[#0284C7]',
        accentBg: 'bg-[#0284C7]/10',
        textColor: 'text-[#082F49]',
        textMuted: 'text-[#334155]',
        timerBg: 'bg-[#0284C7]',
        waveColor: '#0284C7',
        pillBg: 'bg-[#082F49]',
        pillText: 'text-white',
        dotColor: '#0284C7',
        blobColors: ['#38BDF8', '#818CF8', '#E0F2FE'],
      };

    default:
      return getThemeConfig('terracotta', isDark);
  }
};

export const THEMES: Record<ThemeId, { name: string; preview: string; isDarkSupported: boolean }> = {
  terracotta: {
    name: 'Terracotta & Clay',
    preview: '#E07A5F',
    isDarkSupported: true,
  },
  pastel: {
    name: 'Pastel Campus',
    preview: '#A799FF',
    isDarkSupported: true,
  },
  violet: {
    name: 'Royal Violet & Coral',
    preview: '#4E3696',
    isDarkSupported: true,
  },
  midnight: {
    name: 'Midnight Ocean',
    preview: '#06B6D4',
    isDarkSupported: true,
  },
};

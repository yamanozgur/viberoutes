import React from 'react';
import { MainCategory } from '../types';

export const CATEGORY_COLORS: Record<
  MainCategory,
  {
    bg: string;
    text: string;
    border: string;
    pillBg: string;
    dot: string;
    accentHex: string;
  }
> = {
  destinations: {
    bg: 'bg-[#0284C7]',
    text: 'text-[#0284C7]',
    border: 'border-[#0284C7]',
    pillBg: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
    dot: 'bg-[#0284C7]',
    accentHex: '#0284C7',
  },
  stay: {
    bg: 'bg-[#D97706]',
    text: 'text-[#B45309]',
    border: 'border-[#D97706]',
    pillBg: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    dot: 'bg-[#D97706]',
    accentHex: '#D97706',
  },
  experiences: {
    bg: 'bg-[#059669]',
    text: 'text-[#047857]',
    border: 'border-[#059669]',
    pillBg: 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]',
    dot: 'bg-[#059669]',
    accentHex: '#059669',
  },
  lists: {
    bg: 'bg-[#EA580C]',
    text: 'text-[#C2410C]',
    border: 'border-[#EA580C]',
    pillBg: 'bg-[#FFEDD5] text-[#9A3412] border-[#FED7AA]',
    dot: 'bg-[#EA580C]',
    accentHex: '#EA580C',
  },
  'the-life': {
    bg: 'bg-[#7C3AED]',
    text: 'text-[#6D28D9]',
    border: 'border-[#7C3AED]',
    pillBg: 'bg-[#EDE9FE] text-[#5B21B6] border-[#DDD6FE]',
    dot: 'bg-[#7C3AED]',
    accentHex: '#7C3AED',
  },
  gear: {
    bg: 'bg-[#0D9488]',
    text: 'text-[#0F766E]',
    border: 'border-[#0D9488]',
    pillBg: 'bg-[#CCFBF1] text-[#115E59] border-[#99F6E4]',
    dot: 'bg-[#0D9488]',
    accentHex: '#0D9488',
  },
};

export const getCategoryStyles = (category: string) => {
  const normalized = category.toLowerCase() as MainCategory;
  return (
    CATEGORY_COLORS[normalized] || {
      bg: 'bg-[#9E7B54]',
      text: 'text-[#9E7B54]',
      border: 'border-[#9E7B54]',
      pillBg: 'bg-[#FAF6F0] text-[#765835] border-[#E8DFC8]',
      dot: 'bg-[#9E7B54]',
      accentHex: '#9E7B54',
    }
  );
};

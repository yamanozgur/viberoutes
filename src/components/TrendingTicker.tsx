import React from 'react';
import { Flame, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { Article } from '../types';

interface TrendingTickerProps {
  onSelectTopic: (topic: string) => void;
  onSelectArticle?: (article: Article) => void;
  articles: Article[];
}

const TRENDING_TOPICS = [
  { label: 'Desert Sanctuaries', region: 'Middle East', color: 'text-[#D97706]' },
  { label: 'Dublin Literary Pubs', region: 'Ireland', color: 'text-[#0284C7]' },
  { label: 'Oaxaca Culinary Trails', region: 'Mexico', color: 'text-[#EA580C]' },
  { label: 'Kyoto Zen Machiyas', region: 'Japan', color: 'text-[#059669]' },
  { label: 'Amalfi Coast Terraces', region: 'Italy', color: 'text-[#0284C7]' },
  { label: 'Slovenia Alpine Lakes', region: 'Slovenia', color: 'text-[#0D9488]' },
];

export const TrendingTicker: React.FC<TrendingTickerProps> = ({
  onSelectTopic,
  onSelectArticle,
  articles,
}) => {
  const handleTopicClick = (topic: typeof TRENDING_TOPICS[0]) => {
    // Find matching article if available
    const matched = articles.find(
      (a) =>
        a.region.toLowerCase().includes(topic.region.toLowerCase()) ||
        a.title.toLowerCase().includes(topic.label.toLowerCase()) ||
        a.tags?.some((t) => t.toLowerCase().includes(topic.region.toLowerCase()))
    );

    if (matched && onSelectArticle) {
      onSelectArticle(matched);
    } else {
      onSelectTopic(topic.region);
    }
  };

  return (
    <div className="bg-[#FFFFFF] border-b border-[#E5E0D8] text-xs font-ui py-2.5 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Badge */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] font-medium uppercase tracking-wider text-[10px]">
            <Flame className="w-3 h-3 text-[#D97706]" />
            <span>TRENDING NOW</span>
          </div>
        </div>

        {/* Scrollable list of topics */}
        <div className="flex items-center space-x-4 sm:space-x-6 overflow-x-auto no-scrollbar py-0.5 text-[#4A453E]">
          {TRENDING_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => handleTopicClick(topic)}
              className="flex items-center space-x-1.5 whitespace-nowrap hover:text-[#1A1814] transition-colors cursor-pointer group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]/70 group-hover:scale-125 transition-transform" />
              <span className="font-medium text-[#1A1814] group-hover:text-[#9E7B54]">
                {topic.label}
              </span>
              <span className="text-[10px] text-[#8C827A] font-light">
                ({topic.region})
              </span>
            </button>
          ))}
        </div>

        {/* Right fast tag */}
        <div className="hidden lg:flex items-center space-x-1 text-[11px] text-[#8C827A] shrink-0 font-light">
          <Sparkles className="w-3 h-3 text-[#D97706]" />
          <span>Curated for Discerning Travelers</span>
        </div>
      </div>
    </div>
  );
};

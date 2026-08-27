import React from 'react';
import { Article } from '../types';
import { Bookmark, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface HeroFeaturedProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
  isBookmarked: boolean;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  article,
  onSelectArticle,
  onToggleBookmark,
  isBookmarked,
}) => {
  if (!article) return null;

  return (
    <section className="relative border-b border-[#E5E0D8] bg-[#FAFAF7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
        {/* Issue & Editorial Tag */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E5E0D8]">
          <div className="flex items-center space-x-3 text-xs tracking-widest uppercase font-ui text-[#767064]">
            <span className="text-[#1A1814] font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#9E7B54]" />
              Cover Story
            </span>
            <span className="text-[#C4BCAD]">/</span>
            <span>{article.category}</span>
            <span className="text-[#C4BCAD]">/</span>
            <span className="text-[#1A1814] font-normal">{article.region}</span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-ui text-[#767064]">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(article.id);
              }}
              className={`p-1.5 border transition-colors cursor-pointer ${
                isBookmarked ? 'bg-[#1A1814] text-[#FAFAF7] border-[#1A1814]' : 'border-[#E5E0D8] text-[#767064] hover:text-[#1A1814] bg-[#FFFFFF]'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Save for later'}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Large Editorial Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Excerpt */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] font-ui text-[#767064] block">
                {article.subCategory}
              </span>
              <h1
                onClick={() => onSelectArticle(article)}
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1814] leading-[1.12] tracking-tight hover:text-[#9E7B54] transition-colors cursor-pointer"
              >
                {article.title}
              </h1>
              <p className="font-display text-lg sm:text-xl italic text-[#9E7B54] font-light leading-relaxed">
                {article.subtitle}
              </p>
            </div>

            <p className="font-ui text-sm sm:text-[15.5px] text-[#38342D] leading-[1.85] font-light max-w-xl">
              {article.excerpt}
            </p>

            <div className="pt-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs font-ui text-[#767064]">
                <div className="w-7 h-7 rounded-full bg-[#EBE5DC] border border-[#D8D2C7] flex items-center justify-center font-display text-xs text-[#1A1814]">
                  {article.author.name.charAt(0)}
                </div>
                <div>
                  <span className="text-[#1A1814] font-medium block">{article.author.name}</span>
                  <span className="text-[#767064] text-[11px]">{article.author.role}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectArticle(article)}
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-ui font-medium text-[#FAFAF7] bg-[#1A1814] hover:bg-[#9E7B54] px-5 py-3 border border-[#1A1814] transition-all cursor-pointer shadow-xs"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Hero Cinematic Image */}
          <div
            onClick={() => onSelectArticle(article)}
            className="lg:col-span-6 cursor-pointer group relative overflow-hidden bg-[#F4EFEA] border border-[#E5E0D8]"
          >
            <div className="aspect-[4/3] sm:aspect-[16/11] overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              />
            </div>
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#1A1814]/80 via-[#1A1814]/30 to-transparent text-[#FAFAF7] flex justify-between items-end">
              <span className="text-xs font-ui tracking-wider uppercase text-[#E2C799] font-medium">{article.region}</span>
              <span className="text-xs font-display italic text-[#E5E0D8]">Monocle / Kinfolk Archive #2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

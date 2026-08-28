import React from 'react';
import { Article } from '../types';
import { Bookmark, Clock, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { getCategoryStyles } from '../utils/categoryColors';

interface HeroFeaturedProps {
  article: Article;
  sideArticles?: Article[];
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
  isBookmarked: boolean;
  bookmarkedIds?: string[];
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  article,
  sideArticles = [],
  onSelectArticle,
  onToggleBookmark,
  isBookmarked,
  bookmarkedIds = [],
}) => {
  if (!article) return null;

  const categoryStyle = getCategoryStyles(article.category);

  return (
    <section className="relative border-b border-[#E5E0D8] bg-[#FFFFFF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        
        {/* Main 2-Column Condé Nast Magazine Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT 65%: LEAD COVER STORY */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5 bg-[#FAFAF8] p-6 sm:p-8 border border-[#E8E3DA] shadow-xs">
            {/* Top Eyebrow Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DA]">
              <div className="flex items-center space-x-2.5">
                <span className="px-2.5 py-1 text-[11px] font-ui uppercase tracking-wider font-semibold bg-[#1A1814] text-[#FAFAF7]">
                  ✨ COVER STORY
                </span>
                <span className={`px-2 py-0.5 text-[11px] font-ui uppercase tracking-wider font-medium border ${categoryStyle.pillBg}`}>
                  {article.category}
                </span>
                <span className="text-[#8C827A] text-xs font-light">
                  · {article.region}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs font-ui text-[#767064]">
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
                    isBookmarked
                      ? 'bg-[#1A1814] text-[#FAFAF7] border-[#1A1814]'
                      : 'border-[#D8D2C7] text-[#767064] hover:text-[#1A1814] bg-[#FFFFFF]'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Save for later'}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cinematic Hero Image */}
            <div
              onClick={() => onSelectArticle(article)}
              className="cursor-pointer group relative overflow-hidden bg-[#EFEAE2] border border-[#DCD5C9] aspect-[16/10]"
            >
              <img
                src={article.coverImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.2em] font-ui text-[#524B43] block font-bold">
                {article.subCategory}
              </span>
              <h1
                onClick={() => onSelectArticle(article)}
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#14120E] leading-[1.2] tracking-tight hover:text-[#9E7B54] transition-colors cursor-pointer"
              >
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="font-display text-lg sm:text-xl italic text-[#84633E] font-medium leading-relaxed">
                  {article.subtitle}
                </p>
              )}
            </div>

            {/* Author and Read CTA */}
            <div className="pt-4 border-t border-[#E8E3DA] flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs sm:text-sm font-ui text-[#403B35]">
                <div className="w-8 h-8 rounded-full bg-[#1A1814] text-[#FAF8F5] flex items-center justify-center font-display text-sm font-bold">
                  {article.author.name.charAt(0)}
                </div>
                <div>
                  <span className="text-[#14120E] font-bold block">{article.author.name}</span>
                  <span className="text-[#665E54] text-xs">{article.author.role}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectArticle(article)}
                className="inline-flex items-center space-x-2 text-xs sm:text-sm uppercase tracking-wider font-ui font-bold text-[#FAFAF7] bg-[#1A1814] hover:bg-[#9E7B54] px-6 py-3.5 border border-[#1A1814] transition-all cursor-pointer shadow-xs"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT 35%: TOP STORIES TODAY (Condé Nast Vertical Stack) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#1A1814]">
              <div className="flex items-center space-x-2 text-[#1A1814]">
                <TrendingUp className="w-4 h-4 text-[#D97706]" />
                <h3 className="font-display text-xl font-bold tracking-wide uppercase">
                  TOP STORIES TODAY
                </h3>
              </div>
              <span className="text-xs font-ui text-[#665E54] uppercase tracking-wider font-semibold">
                Vibe Routes Edit
              </span>
            </div>

            {/* Vertical Articles Stack */}
            <div className="flex flex-col space-y-3.5 grow justify-between">
              {sideArticles.slice(0, 3).map((sideArt, index) => {
                const sideCatStyle = getCategoryStyles(sideArt.category);

                return (
                  <article
                    key={sideArt.id}
                    onClick={() => onSelectArticle(sideArt)}
                    className="group bg-[#FFFFFF] p-4.5 border border-[#E5E0D8] hover:border-[#9E7B54] hover:shadow-xs transition-all cursor-pointer flex gap-4 items-center"
                  >
                    {/* Number Badge */}
                    <div className="shrink-0 font-display text-3xl sm:text-4xl font-semibold text-[#8C827A] group-hover:text-[#9E7B54] transition-colors w-9 text-center">
                      0{index + 1}
                    </div>

                    {/* Content */}
                    <div className="grow min-w-0 space-y-1.5">
                      <div className="flex items-center space-x-2 text-xs font-ui uppercase tracking-wider font-semibold">
                        <span className={`px-2 py-0.5 border ${sideCatStyle.pillBg} font-bold text-[11px]`}>
                          {sideArt.subCategory || sideArt.category}
                        </span>
                        <span className="text-[#665E54]">{sideArt.region}</span>
                      </div>

                      <h4 className="font-display text-lg sm:text-xl font-semibold text-[#14120E] group-hover:text-[#9E7B54] transition-colors leading-snug line-clamp-2">
                        {sideArt.title}
                      </h4>

                      <div className="flex items-center space-x-2 text-xs font-ui text-[#524B43] font-medium">
                        <span className="text-[#3D3730] font-semibold">{sideArt.author.name}</span>
                        <span>•</span>
                        <span>{sideArt.readTime}</span>
                      </div>
                    </div>

                    {/* Thumbnail Image */}
                    <div className="w-22 h-22 shrink-0 bg-[#EFEAE2] border border-[#E5E0D8] overflow-hidden">
                      <img
                        src={sideArt.coverImage}
                        alt={sideArt.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      />
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Newsletter / Quick Callout Banner */}
            <div className="bg-[#FAF6F0] p-4 border border-[#E8DFC8] flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-ui uppercase tracking-widest text-[#B45309] font-bold block">
                  DIGITAL TRAVEL DISPATCH
                </span>
                <p className="text-sm font-display text-[#14120E] font-medium">
                  Curated boutique hotels, guides & private routes weekly.
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1A1814] text-[#FAF8F5] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

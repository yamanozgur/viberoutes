import React from 'react';
import { Article } from '../types';
import { Bookmark, Clock, ArrowUpRight, Sparkles } from 'lucide-react';
import { getCategoryStyles } from '../utils/categoryColors';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
  isBookmarked: boolean;
  layout?: 'standard' | 'compact' | 'horizontal';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelectArticle,
  onToggleBookmark,
  isBookmarked,
  layout = 'standard',
}) => {
  if (!article) return null;

  const categoryStyle = getCategoryStyles(article.category);

  if (layout === 'horizontal') {
    return (
      <article
        onClick={() => onSelectArticle(article)}
        className="group grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-6 bg-[#FFFFFF] hover:bg-[#FAF8F5] border border-[#E5E0D8] hover:border-[#9E7B54] transition-all cursor-pointer shadow-xs"
      >
        <div className="md:col-span-4 aspect-[16/10] overflow-hidden bg-[#F4EFEA] relative border border-[#E8E3DA]">
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-2.5 left-2.5">
            <span className={`px-2 py-0.5 text-[10px] font-ui uppercase tracking-wider font-semibold border ${categoryStyle.pillBg} shadow-xs`}>
              {article.subCategory || article.category}
            </span>
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-[#524B43] font-ui uppercase tracking-wider mb-2 font-medium">
              <span className="text-[#3D3730] font-semibold">{article.region}</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-[#524B43]" />
                <span>{article.readTime}</span>
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl lg:text-[1.7rem] font-semibold text-[#14120E] group-hover:text-[#9E7B54] transition-colors leading-snug">
              {article.title}
            </h3>

            {article.subtitle && (
              <p className="font-display text-base italic text-[#84633E] font-medium mt-1">
                {article.subtitle}
              </p>
            )}

            <p className="font-ui text-sm sm:text-base text-[#2C2824] font-normal mt-2.5 line-clamp-3 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E5E0D8]">
            <span className="text-xs sm:text-sm text-[#3D3730] font-ui font-semibold">By {article.author.name}</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(article.id);
                }}
                className={`p-1.5 border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-[#1A1814] text-[#FAFAF7] border-[#1A1814]'
                    : 'border-[#E5E0D8] text-[#767064] hover:text-[#1A1814] bg-[#FFFFFF]'
                }`}
                title="Bookmark"
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs sm:text-sm font-ui uppercase tracking-wider text-[#1A1814] font-bold flex items-center gap-0.5 group-hover:text-[#9E7B54]">
                Read Story <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => onSelectArticle(article)}
      className="group flex flex-col justify-between bg-[#FFFFFF] border border-[#E5E0D8] hover:border-[#9E7B54] hover:shadow-md transition-all cursor-pointer overflow-hidden shadow-2xs"
    >
      <div>
        {/* Photo Container */}
        <div className="aspect-[16/10] overflow-hidden bg-[#F4EFEA] relative border-b border-[#E8E3DA]">
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
          />

          {/* Category Chip */}
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 text-[10px] font-ui uppercase tracking-wider font-semibold border ${categoryStyle.pillBg} shadow-xs backdrop-blur-xs`}>
              {article.subCategory || article.category}
            </span>
          </div>

          {/* Stays Counter Badge */}
          {article.hotelData && article.hotelData.length > 0 && (
            <div className="absolute bottom-3 right-3 bg-[#1A1814]/90 text-[#FAFAF7] px-2 py-0.5 text-[10px] font-ui uppercase tracking-wider font-medium backdrop-blur-xs border border-[#332E27]">
              🏨 {article.hotelData.length} Stays Included
            </div>
          )}
        </div>

        {/* Text Container */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#524B43] font-ui uppercase tracking-wider font-semibold">
            <span className="text-[#3D3730]">{article.region}</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#524B43]" />
              <span>{article.readTime}</span>
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#14120E] leading-snug group-hover:text-[#9E7B54] transition-colors">
            {article.title}
          </h3>

          <p className="font-ui text-sm sm:text-base text-[#2C2824] font-normal line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6 pt-0 border-t border-[#EFEAE2] mt-4 flex items-center justify-between">
        <span className="text-xs sm:text-sm text-[#3D3730] font-ui font-semibold">By {article.author.name}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(article.id);
            }}
            className={`p-1.5 border transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-[#1A1814] text-[#FAFAF7] border-[#1A1814]'
                : 'border-[#E5E0D8] text-[#767064] hover:text-[#1A1814] bg-[#FFFFFF]'
            }`}
            title="Bookmark"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs sm:text-sm font-ui uppercase tracking-wider text-[#1A1814] font-bold flex items-center gap-0.5 group-hover:text-[#9E7B54]">
            Read <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};

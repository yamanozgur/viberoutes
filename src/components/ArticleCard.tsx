import React from 'react';
import { Article } from '../types';
import { Bookmark, Clock, ArrowUpRight } from 'lucide-react';

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

  if (layout === 'horizontal') {
    return (
      <article
        onClick={() => onSelectArticle(article)}
        className="group grid grid-cols-1 md:grid-cols-12 gap-6 p-4 sm:p-6 bg-[#FFFFFF] hover:bg-[#F9F7F4] border border-[#E5E0D8] hover:border-[#C4BCAD] transition-all cursor-pointer shadow-xs"
      >
        <div className="md:col-span-4 aspect-[16/10] overflow-hidden bg-[#F4EFEA]">
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="md:col-span-8 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-[#767064] font-ui uppercase tracking-wider mb-2">
              <span>{article.category} · {article.subCategory}</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-[#767064]" />
                <span>{article.readTime}</span>
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-light text-[#1A1814] group-hover:text-[#9E7B54] transition-colors leading-snug">
              {article.title}
            </h3>
            <p className="font-ui text-sm text-[#4A453E] font-light mt-2 line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E5E0D8]">
            <span className="text-xs text-[#767064] font-ui">{article.publishedDate}</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(article.id);
                }}
                className={`p-1.5 border transition-colors cursor-pointer ${
                  isBookmarked ? 'bg-[#1A1814] text-[#FAFAF7] border-[#1A1814]' : 'border-[#E5E0D8] text-[#767064] hover:text-[#1A1814] bg-[#FFFFFF]'
                }`}
                title="Bookmark"
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-ui uppercase tracking-wider text-[#1A1814] font-medium flex items-center gap-0.5 group-hover:text-[#9E7B54]">
                Read <ArrowUpRight className="w-3.5 h-3.5" />
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
      className="group flex flex-col justify-between bg-[#FFFFFF] border border-[#E5E0D8] hover:border-[#C4BCAD] transition-all cursor-pointer overflow-hidden shadow-xs"
    >
      <div>
        <div className="aspect-[16/10] overflow-hidden bg-[#F4EFEA] relative">
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-ui uppercase tracking-widest text-[#1A1814] border border-[#E5E0D8]">
            {article.subCategory}
          </div>
          {article.hotelData && article.hotelData.length > 0 && (
            <div className="absolute bottom-3 right-3 bg-[#1A1814] text-[#FAFAF7] px-2 py-0.5 text-[10px] font-ui uppercase tracking-wider font-medium">
              {article.hotelData.length} Stays Included
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-[#767064] font-ui uppercase tracking-widest">
            <span>{article.region}</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-[#767064]" />
              <span>{article.readTime}</span>
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-light text-[#1A1814] leading-snug group-hover:text-[#9E7B54] transition-colors">
            {article.title}
          </h3>

          <p className="font-ui text-sm text-[#4A453E] font-light line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6 pt-0 border-t border-[#E5E0D8] mt-4 flex items-center justify-between">
        <span className="text-xs text-[#767064] font-ui">{article.author.name}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(article.id);
            }}
            className={`p-1.5 border transition-colors cursor-pointer ${
              isBookmarked ? 'bg-[#1A1814] text-[#FAFAF7] border-[#1A1814]' : 'border-[#E5E0D8] text-[#767064] hover:text-[#1A1814] bg-[#FFFFFF]'
            }`}
            title="Bookmark"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-ui uppercase tracking-wider text-[#1A1814] font-medium flex items-center gap-0.5 group-hover:text-[#9E7B54]">
            Read <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};

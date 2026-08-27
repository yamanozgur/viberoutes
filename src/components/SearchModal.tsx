import React, { useState } from 'react';
import { Article } from '../types';
import { Search, X, Clock, ArrowRight, MapPin } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = articles.filter((art) => {
    const matchesQuery =
      art.title.toLowerCase().includes(query.toLowerCase()) ||
      art.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      art.region.toLowerCase().includes(query.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;

    return matchesQuery && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-20 bg-[#1A1814]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-[#2D2924]">
        {/* Search Input Header */}
        <div className="p-4 sm:p-6 border-b border-[#E5E0D8] bg-[#F7F5F0] flex items-center space-x-3">
          <Search className="w-5 h-5 text-[#767064] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search boutique stays, destination guides, slow routes, or gear..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent font-display text-xl sm:text-2xl text-[#1A1814] placeholder-[#767064] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#767064] hover:text-[#1A1814] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className="px-6 py-2.5 bg-[#FFFFFF] border-b border-[#E5E0D8] flex items-center space-x-2 text-xs font-ui overflow-x-auto">
          <span className="text-[#767064] text-[11px] uppercase tracking-wider shrink-0">Filter:</span>
          {['all', 'destinations', 'stay', 'experiences', 'gear', 'the-life'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs uppercase tracking-wider capitalize whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1A1814] text-[#FAFAF7] font-medium'
                  : 'bg-[#F7F5F0] text-[#767064] hover:text-[#1A1814] hover:bg-[#EBE5DC]'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 grow">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#767064] font-ui space-y-2">
              <p className="font-display text-xl text-[#1A1814]">No articles found for "{query}"</p>
              <p className="text-xs">Try searching for "Tokyo", "Converted Buildings", "Patagonia", or "Luggage".</p>
            </div>
          ) : (
            filtered.map((art) => (
              <div
                key={art.id}
                onClick={() => {
                  onSelectArticle(art);
                  onClose();
                }}
                className="p-4 bg-[#FAFAF7] hover:bg-[#F2ECE4] border border-[#E5E0D8] hover:border-[#C4BCAD] flex items-center justify-between gap-4 transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-[#EBE5DC] overflow-hidden shrink-0 border border-[#E5E0D8]">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-ui uppercase tracking-wider text-[#767064] block">
                      {art.subCategory} · {art.region}
                    </span>
                    <h4 className="font-display text-lg font-light text-[#1A1814] group-hover:text-[#9E7B54] transition-colors leading-snug line-clamp-1">
                      {art.title}
                    </h4>
                    <p className="text-xs font-ui text-[#4A453E] font-light line-clamp-1 mt-0.5">
                      {art.subtitle}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-[#767064] group-hover:text-[#9E7B54] shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

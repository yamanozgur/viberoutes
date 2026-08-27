import React from 'react';
import { Article } from '../types';
import { X, Trash2, ArrowRight, Bookmark } from 'lucide-react';

interface BookmarkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (articleId: string) => void;
  onClearAll: () => void;
}

export const BookmarkDrawer: React.FC<BookmarkDrawerProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onSelectArticle,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#1A1814]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FFFFFF] border-l border-[#E5E0D8] h-full shadow-2xl flex flex-col justify-between text-[#2D2924]">
        {/* Drawer Header */}
        <div className="p-6 bg-[#F7F5F0] border-b border-[#E5E0D8] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-4 h-4 text-[#9E7B54]" />
            <h3 className="font-display text-2xl font-light text-[#1A1814]">
              Saved Stories ({savedArticles.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#767064] hover:text-[#1A1814] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stories List */}
        <div className="p-6 overflow-y-auto space-y-4 grow">
          {savedArticles.length === 0 ? (
            <div className="text-center py-20 text-[#767064] space-y-3">
              <Bookmark className="w-8 h-8 mx-auto stroke-1 opacity-40 text-[#9E7B54]" />
              <p className="font-display text-xl text-[#1A1814]">No saved stories yet</p>
              <p className="text-xs font-ui max-w-xs mx-auto leading-relaxed">
                Click the bookmark icon on any city guide, boutique stay, or gear review to keep it handy for offline reading.
              </p>
            </div>
          ) : (
            savedArticles.filter((art): art is Article => Boolean(art && art.id)).map((art) => (
              <div
                key={art.id}
                className="p-4 bg-[#FAFAF7] border border-[#E5E0D8] hover:border-[#C4BCAD] transition-all space-y-2 relative group shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="cursor-pointer space-y-1 grow"
                  >
                    <span className="text-[10px] font-ui uppercase tracking-wider text-[#767064]">
                      {art.subCategory}
                    </span>
                    <h4 className="font-display text-lg font-light text-[#1A1814] group-hover:text-[#9E7B54] transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => onRemoveBookmark(art.id)}
                    className="text-[#767064] hover:text-[#C53030] p-1 cursor-pointer shrink-0"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div
                  onClick={() => {
                    onSelectArticle(art);
                    onClose();
                  }}
                  className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between text-xs font-ui text-[#4A453E] cursor-pointer"
                >
                  <span className="text-[#767064]">{art.readTime}</span>
                  <span className="flex items-center gap-1 font-medium text-[#1A1814] group-hover:text-[#9E7B54]">
                    Read Story <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {savedArticles.length > 0 && (
          <div className="p-6 border-t border-[#E5E0D8] bg-[#F7F5F0] flex justify-between items-center text-xs font-ui">
            <button
              onClick={onClearAll}
              className="text-[#767064] hover:text-[#C53030] underline cursor-pointer"
            >
              Clear Reading List
            </button>
            <span className="text-[#767064]">Auto-saved locally</span>
          </div>
        )}
      </div>
    </div>
  );
};

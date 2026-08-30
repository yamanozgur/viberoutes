import React from 'react';
import { Settings2, ArrowUpRight } from 'lucide-react';
import { Article, FeaturedDestination } from '../types';
import { DEFAULT_FEATURED_DESTINATIONS } from '../lib/firestoreService';

interface DestinationsStripProps {
  onSelectDestination: (region: string) => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  destinations?: FeaturedDestination[];
  onOpenAdminToDestinations?: () => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop';

export const DestinationsStrip: React.FC<DestinationsStripProps> = ({
  onSelectDestination,
  articles,
  onSelectArticle,
  destinations,
  onOpenAdminToDestinations,
}) => {
  const activeDestinations = (destinations && destinations.length > 0)
    ? destinations
    : DEFAULT_FEATURED_DESTINATIONS;

  const handleClick = (dest: FeaturedDestination) => {
    // If a specific article is linked
    if (dest.linkedArticleId) {
      const linked = articles.find((a) => a.id === dest.linkedArticleId);
      if (linked) {
        onSelectArticle(linked);
        return;
      }
    }

    // Match by country, name or tag
    const matched = articles.find(
      (a) =>
        a.region.toLowerCase().includes(dest.country.toLowerCase()) ||
        a.title.toLowerCase().includes(dest.name.toLowerCase()) ||
        a.tags?.some((t) => t.toLowerCase().includes(dest.country.toLowerCase()) || t.toLowerCase().includes(dest.tag.toLowerCase()))
    );

    if (matched) {
      onSelectArticle(matched);
    } else {
      onSelectDestination(dest.targetRegion || dest.country);
    }
  };

  return (
    <section className="bg-[#FAF8F5] py-12 border-b border-[#E5E0D8]" id="destinations-focus-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E0D8] pb-4">
          <div>
            <div className="text-[11px] font-ui uppercase tracking-[0.25em] text-[#8C827A] font-semibold flex items-center gap-2">
              <span>VIBE ROUTES TRAVEL COLLECTION</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-[#1A1814] mt-1">
              Destinations in Focus
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-ui text-[#767064] hidden sm:inline">
              Curated regional dossiers & slow travel routes
            </span>
            {onOpenAdminToDestinations && (
              <button
                type="button"
                onClick={onOpenAdminToDestinations}
                title="Bölgeleri Yönet ve Düzenle"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-ui text-[#767064] hover:text-[#1A1814] bg-[#FFFFFF] hover:bg-[#F2ECE4] border border-[#E5E0D8] rounded-xs transition-colors cursor-pointer"
              >
                <Settings2 className="w-3 h-3 text-[#9E7B54]" />
                <span>Kartları Düzenle</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {activeDestinations.map((dest, idx) => (
            <div
              key={dest.id || idx}
              onClick={() => handleClick(dest)}
              className="group relative aspect-[3/4] overflow-hidden bg-[#FAF8F5] border border-[#E5E0D8] hover:border-[#9E7B54] transition-all cursor-pointer shadow-xs rounded-xs"
            >
              {/* Photo */}
              <img
                src={dest.imageUrl || FALLBACK_IMAGE}
                alt={dest.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== FALLBACK_IMAGE) {
                    target.src = FALLBACK_IMAGE;
                  }
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-100"
              />

              {/* Gentle bottom-only vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#14120E]/85 via-[#14120E]/25 to-transparent" />

              {/* Region Pill */}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 text-[9px] font-ui uppercase tracking-widest font-semibold bg-[#FFFFFF]/95 text-[#1A1814] shadow-xs rounded-xs">
                  {dest.tag || 'Explore'}
                </span>
              </div>

              {/* Top-Right Arrow Hover Indicator */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="p-1 bg-[#1A1814]/70 text-[#FFFFFF] rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-3 h-3 text-[#E2C799]" />
                </span>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-3 left-3 right-3 space-y-0.5 text-white">
                <span className="text-[10px] font-ui uppercase tracking-wider text-[#FAF8F5]/90 font-medium block drop-shadow-xs">
                  {dest.country}
                </span>
                <h4 className="font-display text-base sm:text-lg font-medium leading-tight text-[#FFFFFF] group-hover:text-[#E2C799] transition-colors drop-shadow-sm line-clamp-1">
                  {dest.name}
                </h4>
                {dest.tagline && (
                  <p className="text-[10.5px] font-ui text-[#FAF8F5]/85 font-normal line-clamp-1 drop-shadow-xs">
                    {dest.tagline}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

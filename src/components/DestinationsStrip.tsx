import React from 'react';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface DestinationsStripProps {
  onSelectDestination: (region: string) => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

const FEATURED_DESTINATIONS = [
  {
    name: 'Dubai & Desert',
    country: 'United Arab Emirates',
    tagline: 'Desert Sanctuaries & Avant-Garde',
    tag: 'Middle East',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
    accentColor: 'border-[#D97706]',
    badgeBg: 'bg-[#D97706]',
  },
  {
    name: 'Dublin & Ireland',
    country: 'Ireland',
    tagline: 'Literary Ghosts & Amber Pubs',
    tag: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?q=80&w=800&auto=format&fit=crop',
    accentColor: 'border-[#0284C7]',
    badgeBg: 'bg-[#0284C7]',
  },
  {
    name: 'Oaxaca & CDMX',
    country: 'Mexico',
    tagline: 'Culinary Soul & Green Stone',
    tag: 'Americas',
    imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=800&auto=format&fit=crop',
    accentColor: 'border-[#EA580C]',
    badgeBg: 'bg-[#EA580C]',
  },
  {
    name: 'Kyoto & Gion',
    country: 'Japan',
    tagline: 'Machiyas & Zen Solitude',
    tag: 'Asia',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
    accentColor: 'border-[#059669]',
    badgeBg: 'bg-[#059669]',
  },
  {
    name: 'Amalfi Coast',
    country: 'Italy',
    tagline: 'Cliffside Terraces & Cobalt Sea',
    tag: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop',
    accentColor: 'border-[#0284C7]',
    badgeBg: 'bg-[#0284C7]',
  },
  {
    name: 'Julian Alps',
    country: 'Slovenia',
    tagline: 'Emerald Rivers & Secret Lakes',
    tag: 'Hidden Gems',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?q=80&w=800&auto=format&fit=crop',
    accentColor: 'border-[#0D9488]',
    badgeBg: 'bg-[#0D9488]',
  },
];

export const DestinationsStrip: React.FC<DestinationsStripProps> = ({
  onSelectDestination,
  articles,
  onSelectArticle,
}) => {
  const handleClick = (dest: typeof FEATURED_DESTINATIONS[0]) => {
    const matched = articles.find(
      (a) =>
        a.region.toLowerCase().includes(dest.country.toLowerCase()) ||
        a.title.toLowerCase().includes(dest.name.toLowerCase()) ||
        a.tags?.some((t) => t.toLowerCase().includes(dest.country.toLowerCase()))
    );

    if (matched) {
      onSelectArticle(matched);
    } else {
      onSelectDestination(dest.country);
    }
  };

  return (
    <section className="bg-[#FAF8F5] py-12 border-b border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E0D8] pb-4">
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-ui uppercase tracking-[0.25em] text-[#8C827A] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Condé Nast Travel Collection</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-[#1A1814] mt-1">
              Destinations in Focus
            </h2>
          </div>

          <span className="text-xs font-ui text-[#767064]">
            Curated regional dossiers & slow travel routes
          </span>
        </div>

        {/* 6-Column Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {FEATURED_DESTINATIONS.map((dest, idx) => (
            <div
              key={idx}
              onClick={() => handleClick(dest)}
              className="group relative aspect-[3/4] overflow-hidden bg-[#1A1814] border border-[#E5E0D8] hover:border-[#9E7B54] transition-all cursor-pointer shadow-xs"
            >
              {/* Photo */}
              <img
                src={dest.imageUrl}
                alt={dest.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-85 group-hover:opacity-95"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Region Pill */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 text-[9px] font-ui uppercase tracking-widest font-semibold bg-[#FFFFFF]/90 text-[#1A1814] backdrop-blur-xs">
                  {dest.tag}
                </span>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-3 left-3 right-3 space-y-1 text-white">
                <span className="text-[10px] font-ui uppercase tracking-wider text-[#E5E0D8] block">
                  {dest.country}
                </span>
                <h4 className="font-display text-base sm:text-lg font-medium leading-tight group-hover:text-[#E2C799] transition-colors">
                  {dest.name}
                </h4>
                <p className="text-[10px] font-ui text-[#C4BCAD] font-light line-clamp-1">
                  {dest.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

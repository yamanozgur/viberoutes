import React, { useState } from 'react';
import { Article, HotelFeature } from '../types';
import { CURATED_ROUTES } from '../data/curatedRoutes';
import { Compass, Sparkles, ArrowRight, Check, MapPin, Building, Trees, Moon, Coffee, Heart } from 'lucide-react';

interface VibeFinderProps {
  onSelectArticle: (article: Article) => void;
  articles: Article[];
  onOpenBookingModal: (item: any) => void;
}

export const VibeFinder: React.FC<VibeFinderProps> = ({
  onSelectArticle,
  articles,
  onOpenBookingModal,
}) => {
  const [travelerType, setTravelerType] = useState<'solo' | 'couple' | 'nomad'>('couple');
  const [aesthetic, setAesthetic] = useState<'historic' | 'desert' | 'monastic' | 'nature' | 'urban'>('historic');
  const [season, setSeason] = useState<'spring' | 'autumn' | 'winter'>('autumn');

  // Filter recommendations based on user selections
  const getRecommendation = () => {
    if (aesthetic === 'historic') {
      return {
        title: 'The European Adaptive Reuse Circuit',
        subtitle: '19th-Century Monasteries & Historic Townhouses',
        description: 'Ideal for child-free couples who value spatial history, private courtyards, and Michelin-starred dining in converted bank vaults.',
        matchedArticleSlug: 'converted-buildings-best-hotels',
        hotel: {
          name: 'Ett Hem Stockholm',
          location: 'Stockholm, Sweden',
          rate: 'From €640 / night',
          provider: 'Mr & Mrs Smith',
          url: 'https://www.mrandmrssmith.com/luxury-hotels/ett-hem?aff=viberoutes',
          image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
          highlight: 'Studio Ilse design, Swedish fireplace stoves, and biodynamic garden cuisine.'
        }
      };
    } else if (aesthetic === 'desert') {
      return {
        title: 'The Arid Silence & Starlight Route',
        subtitle: 'Navajo Sandstone & Nabataean Escarpments',
        description: 'Raw earth architecture submerged into geological formations. Designed for sensory decompression and horizon gazing.',
        matchedArticleSlug: 'desert-hotels-raw-sandstone-retreats',
        hotel: {
          name: 'Amangiri Utah',
          location: 'Canyon Point, USA',
          rate: 'From €2,800 / night',
          provider: 'Mr & Mrs Smith',
          url: 'https://www.mrandmrssmith.com/luxury-hotels/amangiri?aff=viberoutes',
          image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
          highlight: 'Organic concrete pool wrapped around an 80-foot Jurassic sandstone ridge.'
        }
      };
    } else if (aesthetic === 'monastic') {
      return {
        title: 'The Silent Japanese Winter Guide',
        subtitle: 'Kissaten, Wabi-Sabi Wood & Snow Onsens',
        description: 'For solo thinkers and design couples. Quiet Tokyo neighborhoods, Nel drip pour-overs, and snowy timber ryokans in Yamagata.',
        matchedArticleSlug: 'tokyo-murakami-jazz-rain',
        hotel: {
          name: 'Trunk (Hotel) Yoyogi Park',
          location: 'Tokyo, Japan',
          rate: 'From €520 / night',
          provider: 'Mr & Mrs Smith',
          url: 'https://www.mrandmrssmith.com/luxury-hotels/trunk-hotel-yoyogi-park?aff=viberoutes',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          highlight: 'Keiji Ashizawa and Norm Architects oak interiors overlooking evergreen shrine canopy.'
        }
      };
    } else {
      return {
        title: 'The Subantarctic & Patagonia Expedition',
        subtitle: 'Lenga Forests & Glacial Silence',
        description: 'Far beyond conventional mass tourism. Autumn foliage, windless glassy glacial lakes, and solitary timber architecture.',
        matchedArticleSlug: 'patagonia-autumn-silence',
        hotel: {
          name: 'Tierra Patagonia Hotel & Spa',
          location: 'Torres del Paine, Chile',
          rate: 'From €1,250 / night',
          provider: 'Mr & Mrs Smith',
          url: 'https://www.mrandmrssmith.com/luxury-hotels/tierra-patagonia?aff=viberoutes',
          image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
          highlight: 'Organic lenga wood shell mimicking a fossil stranded by ancient glaciers.'
        }
      };
    }
  };

  const rec = getRecommendation();
  const matchedArticle = articles.find((a) => a.slug === rec.matchedArticleSlug);

  return (
    <div className="bg-[#FAFAF7] min-h-screen py-10 px-4 sm:px-8 text-[#2D2924]">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] font-ui text-[#9E7B54] bg-[#FFFFFF] px-3.5 py-1 border border-[#E5E0D8] shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#9E7B54]" />
            <span>Interactive Route Curator</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-[#1A1814]">
            Find Your Vibe Route
          </h1>
          <p className="font-ui text-sm text-[#767064] font-light leading-relaxed">
            Select your traveling companion, preferred architectural atmosphere, and season to receive a tailored itinerary and verified boutique stay.
          </p>
        </div>

        {/* Step 1: Who are you traveling with? */}
        <div className="bg-[#FFFFFF] border border-[#E5E0D8] p-6 sm:p-8 space-y-4 shadow-xs">
          <span className="text-xs uppercase tracking-widest font-ui text-[#767064] block font-medium">
            01. Traveling Party
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'couple', title: 'Child-Free Couple', desc: 'Intimate boutique suites, fine food, calm aesthetics.' },
              { id: 'solo', title: 'Solo Cultured Traveler', desc: 'Solitary reflection, library bars, receptive gaze.' },
              { id: 'nomad', title: 'Remote Professional', desc: 'Fiber speed, walkability, design workspace.' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTravelerType(opt.id as any)}
                className={`p-5 text-left border transition-all cursor-pointer ${
                  travelerType === opt.id
                    ? 'border-[#9E7B54] bg-[#F7F5F0] shadow-xs'
                    : 'border-[#E5E0D8] hover:border-[#C4BCAD] bg-[#FAFAF7]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-display text-lg text-[#1A1814] font-medium">{opt.title}</h4>
                  {travelerType === opt.id && <Check className="w-4 h-4 text-[#9E7B54]" />}
                </div>
                <p className="text-xs font-ui text-[#767064] font-light">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Desired Architectural & Spatial Atmosphere */}
        <div className="bg-[#FFFFFF] border border-[#E5E0D8] p-6 sm:p-8 space-y-4 shadow-xs">
          <span className="text-xs uppercase tracking-widest font-ui text-[#767064] block font-medium">
            02. Spatial Aesthetic
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id: 'historic', label: 'Historic Conversion', icon: Building, desc: 'Bank vaults, monasteries, brick silos' },
              { id: 'monastic', label: 'Modernist Silence', icon: Coffee, desc: 'Japanese oak, concrete, rain kissaten' },
              { id: 'desert', label: 'Desert Minimal', icon: Moon, desc: 'Rammed earth, sandstone, starlight' },
              { id: 'nature', label: 'Raw Wilderness', icon: Trees, desc: 'Glacial fjords, lenga forests, timber' },
            ].map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => setAesthetic(opt.id as any)}
                  className={`p-4 text-left border transition-all cursor-pointer ${
                    aesthetic === opt.id
                      ? 'border-[#9E7B54] bg-[#F7F5F0] shadow-xs'
                      : 'border-[#E5E0D8] hover:border-[#C4BCAD] bg-[#FAFAF7]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#9E7B54] mb-2" />
                  <h4 className="font-display text-base text-[#1A1814]">{opt.label}</h4>
                  <p className="text-[11px] font-ui text-[#767064] mt-1">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tailored Recommendation Card */}
        <div className="border border-[#E5E0D8] bg-[#FFFFFF] p-6 sm:p-10 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E0D8] pb-4">
            <span className="text-xs font-ui uppercase tracking-widest text-[#1A1814] font-medium flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#9E7B54]" /> Tailored Vibe Match
            </span>
            <span className="text-xs font-ui text-[#767064]">Confidence: 98% Match</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <h3 className="font-display text-3xl sm:text-4xl font-light text-[#1A1814] leading-tight">
                {rec.title}
              </h3>
              <p className="font-display text-lg italic text-[#9E7B54]">
                {rec.subtitle}
              </p>
              <p className="font-ui text-sm text-[#4A453E] font-light leading-[1.8]">
                {rec.description}
              </p>

              {matchedArticle && (
                <div className="pt-2">
                  <button
                    onClick={() => onSelectArticle(matchedArticle)}
                    className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-ui font-medium text-[#1A1814] bg-[#F7F5F0] hover:bg-[#1A1814] hover:text-[#FAFAF7] px-5 py-3 border border-[#E5E0D8] transition-colors cursor-pointer"
                  >
                    <span>Read Full Editorial Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Matched Stay Card */}
            <div className="lg:col-span-6 bg-[#FAFAF7] border border-[#E5E0D8] p-5 space-y-3 shadow-xs">
              <span className="text-[10px] font-ui uppercase tracking-widest text-[#767064] block">
                Recommended Boutique Stay Pairing
              </span>
              <div className="aspect-[16/10] overflow-hidden bg-[#EBE5DC] border border-[#E5E0D8]">
                <img
                  src={rec.hotel.image}
                  alt={rec.hotel.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-display text-2xl font-light text-[#1A1814]">
                    {rec.hotel.name}
                  </h4>
                  <span className="font-display text-lg font-light text-[#9E7B54]">
                    {rec.hotel.rate}
                  </span>
                </div>
                <p className="text-xs font-ui text-[#767064]">{rec.hotel.location}</p>
                <p className="text-xs font-ui text-[#4A453E] italic mt-2 font-light">
                  "{rec.hotel.highlight}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E0D8] flex justify-end">
                <button
                  onClick={() =>
                    onOpenBookingModal({
                      type: 'hotel',
                      title: rec.hotel.name,
                      provider: rec.hotel.provider,
                      url: rec.hotel.url,
                      price: rec.hotel.rate,
                      location: rec.hotel.location,
                    })
                  }
                  className="w-full py-2.5 bg-[#1A1814] text-[#FAFAF7] hover:bg-[#9E7B54] text-xs uppercase tracking-widest font-ui font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Book via {rec.hotel.provider}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { HotelFeature, Article } from '../types';
import { Sparkles, MapPin, Star, ArrowRight, ExternalLink } from 'lucide-react';

interface HotelShowcaseSectionProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onOpenBookingModal: (item: {
    type: 'hotel' | 'list' | 'gear' | 'generic';
    hotel?: HotelFeature;
    title: string;
    provider: string;
    url: string;
    price?: string;
    location?: string;
  }) => void;
}

export const HotelShowcaseSection: React.FC<HotelShowcaseSectionProps> = ({
  articles,
  onSelectArticle,
  onOpenBookingModal,
}) => {
  // Aggregate boutique hotels from all articles
  const allHotels: { hotel: HotelFeature; parentArticle: Article }[] = [];

  articles.forEach((art) => {
    if (art.hotelData) {
      art.hotelData.forEach((h) => {
        allHotels.push({ hotel: h, parentArticle: art });
      });
    }
  });

  if (allHotels.length === 0) return null;

  return (
    <section className="bg-[#1A1814] text-[#FAF8F5] py-14 sm:py-18 border-y border-[#332E27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#332E27] pb-5">
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-ui uppercase tracking-[0.25em] text-[#D97706] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Condé Nast The Luxury Edit</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-[#FAF8F5] mt-1.5">
              Boutique Stays & Historic Sanctuaries
            </h2>
          </div>

          <p className="text-xs font-ui text-[#A8A096] max-w-md font-light leading-relaxed">
            Every hotel in our edit is independently verified for architectural integrity, culinary standard, and profound sense of place.
          </p>
        </div>

        {/* 3-Column Luxury Hotel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allHotels.slice(0, 3).map(({ hotel, parentArticle }, idx) => (
            <div
              key={idx}
              className="bg-[#24211C] border border-[#3D3730] hover:border-[#D97706] transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
            >
              {/* Hotel Image with Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#1A1814]">
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#1A1814]/85 backdrop-blur-xs px-2.5 py-1 text-[10px] font-ui uppercase tracking-wider text-[#FAF8F5] border border-[#3D3730]">
                  {hotel.formerLife}
                </div>
                {hotel.priceStarting && (
                  <div className="absolute bottom-3 right-3 bg-[#D97706] text-[#FAF8F5] px-2.5 py-0.5 text-xs font-ui font-medium tracking-wide">
                    From {hotel.priceStarting}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-ui text-[#D97706]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{hotel.location}</span>
                    </span>
                    {hotel.rating && (
                      <span className="flex items-center gap-1 text-[#E5E0D8]">
                        <Star className="w-3 h-3 fill-[#D97706] text-[#D97706]" />
                        <span>{hotel.rating}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-2xl font-light text-[#FAF8F5] group-hover:text-[#E2C799] transition-colors leading-snug">
                    {hotel.name}
                  </h3>

                  <p className="font-ui text-xs text-[#C4BCAD] font-light leading-relaxed line-clamp-3">
                    {hotel.description}
                  </p>
                </div>

                {/* Traveler Tip Box */}
                {hotel.travelerTip && (
                  <div className="p-3 bg-[#1A1814] border-l-2 border-[#D97706] text-[11px] font-ui text-[#D5CFC5] italic">
                    "{hotel.travelerTip}"
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-[#332E27] flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectArticle(parentArticle)}
                    className="text-xs font-ui text-[#D97706] hover:text-[#FAF8F5] underline transition-colors cursor-pointer"
                  >
                    Read Guide Dossier
                  </button>

                  <button
                    onClick={() =>
                      onOpenBookingModal({
                        type: 'hotel',
                        hotel,
                        title: hotel.name,
                        provider: hotel.affiliateProvider || 'Official Booking Desk',
                        url: hotel.affiliateUrl || 'https://www.booking.com',
                        price: hotel.priceStarting,
                        location: hotel.location,
                      })
                    }
                    className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#D97706] text-[#1A1814] hover:text-[#FAF8F5] text-xs font-ui uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Reserve Stay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

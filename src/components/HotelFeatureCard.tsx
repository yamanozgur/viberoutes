import React from 'react';
import { HotelFeature } from '../types';
import { ExternalLink, Sparkles, MapPin, Tag, Compass, ShieldCheck } from 'lucide-react';

interface HotelFeatureCardProps {
  hotel: HotelFeature;
  index: number;
  onBookHotel: (hotel: HotelFeature) => void;
}

export const HotelFeatureCard: React.FC<HotelFeatureCardProps> = ({
  hotel,
  index,
  onBookHotel,
}) => {
  return (
    <div className="border border-[#E5E0D8] bg-[#FFFFFF] overflow-hidden my-8 hover:border-[#C4BCAD] transition-all shadow-xs">
      {/* Header with Rank & Location */}
      <div className="bg-[#F7F5F0] px-6 py-3.5 border-b border-[#E5E0D8] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="w-6 h-6 rounded-full bg-[#1A1814] text-[#FAFAF7] flex items-center justify-center font-display text-xs font-semibold">
            {index + 1}
          </span>
          <h3 className="font-display text-2xl font-light text-[#1A1814] tracking-tight">
            {hotel.name}
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs font-ui text-[#767064]">
          <MapPin className="w-3.5 h-3.5 text-[#9E7B54]" />
          <span>{hotel.location}</span>
          {hotel.rating && (
            <>
              <span className="text-[#C4BCAD]">·</span>
              <span className="text-[#1A1814] font-medium">{hotel.rating}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Hotel Image */}
        <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto overflow-hidden bg-[#F4EFEA] relative">
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-opacity"
          />
          <div className="absolute top-3 left-3 bg-[#FFFFFF]/95 px-2.5 py-1 text-[10px] font-ui uppercase tracking-widest text-[#1A1814] border border-[#E5E0D8] flex items-center gap-1 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-[#9E7B54]" />
            Curated Boutique Stay
          </div>
        </div>

        {/* Content Details following Section 3.4 of Strategy Doc */}
        <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* 1. Former Life (Italicized - Hallmark of the series) */}
            {hotel.formerLife && (
              <div className="border-l-2 border-[#9E7B54] pl-3 py-0.5">
                <span className="text-[11px] font-ui uppercase tracking-wider text-[#767064] block">Former Life</span>
                <p className="font-display text-base sm:text-lg italic text-[#9E7B54] font-light">
                  {hotel.formerLife}
                </p>
              </div>
            )}

            {/* 2. Architect / Transformation */}
            {hotel.architect && (
              <div className="text-xs font-ui text-[#4A453E] flex items-baseline space-x-2">
                <span className="text-[#767064] uppercase tracking-wider text-[10px]">Architect / Restoration:</span>
                <span className="font-medium text-[#1A1814]">{hotel.architect}</span>
              </div>
            )}

            {/* 3. Description */}
            <p className="font-ui text-sm sm:text-[14.5px] text-[#38342D] font-light leading-[1.85]">
              {hotel.description}
            </p>

            {/* 4. Design Highlight */}
            <div className="bg-[#F7F5F0] p-3.5 border border-[#E5E0D8] space-y-1">
              <span className="text-[10px] font-ui uppercase tracking-widest text-[#9E7B54] flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-[#9E7B54]" />
                Design Highlight
              </span>
              <p className="font-ui text-xs sm:text-[13px] text-[#1A1814] font-light leading-relaxed">
                {hotel.designHighlight}
              </p>
            </div>

            {/* 5. Traveler Tip */}
            <div className="text-xs font-ui text-[#4A453E] space-y-1">
              <span className="text-[#767064] uppercase tracking-wider text-[10px] flex items-center gap-1 font-medium">
                <Compass className="w-3 h-3 text-[#9E7B54]" />
                Traveler’s Insider Note:
              </span>
              <p className="font-light italic text-[#4A453E]">
                "{hotel.travelerTip}"
              </p>
            </div>
          </div>

          {/* 6. Pricing & Affiliate Booking Button */}
          <div className="pt-4 border-t border-[#E5E0D8] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#767064] block">From</span>
              <span className="font-display text-xl font-light text-[#1A1814]">
                {hotel.priceStarting}
              </span>
            </div>

            <button
              onClick={() => onBookHotel(hotel)}
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-ui font-medium text-[#FAFAF7] bg-[#1A1814] hover:bg-[#9E7B54] px-5 py-3 transition-colors cursor-pointer shadow-xs"
            >
              <span>Check Rates on {hotel.affiliateProvider}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

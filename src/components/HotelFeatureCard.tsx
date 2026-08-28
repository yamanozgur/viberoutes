import React from 'react';
import { HotelFeature } from '../types';
import { ExternalLink, MapPin, Sparkles } from 'lucide-react';

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
    <div className="border border-[#E5E0D8] bg-[#FFFFFF] overflow-hidden flex flex-col justify-between hover:border-[#9E7B54]/60 transition-all shadow-xs group">
      {/* Image with index badge & price */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F4EFEA]">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2.5 left-2.5 bg-[#1A1814]/90 text-[#FAFAF7] px-2 py-0.5 text-[11px] font-display font-medium rounded-none">
          #{index + 1}
        </div>
        {hotel.rating && (
          <div className="absolute top-2.5 right-2.5 bg-[#FFFFFF]/95 text-[#1A1814] px-2 py-0.5 text-[11px] font-ui font-semibold border border-[#E5E0D8] shadow-xs">
            ★ {hotel.rating}
          </div>
        )}
        {hotel.priceStarting && (
          <div className="absolute bottom-2.5 right-2.5 bg-[#1A1814]/85 text-[#FAFAF7] px-2.5 py-1 text-[11px] font-ui tracking-wide">
            {hotel.priceStarting}
          </div>
        )}
      </div>

      {/* Hotel Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-[11px] font-ui text-[#767064]">
            <MapPin className="w-3 h-3 text-[#9E7B54] shrink-0" />
            <span className="truncate">{hotel.location}</span>
          </div>

          <h3 className="font-display text-lg font-medium text-[#1A1814] leading-snug group-hover:text-[#9E7B54] transition-colors">
            {hotel.name}
          </h3>

          {hotel.formerLife && (
            <p className="text-xs font-reading italic text-[#9E7B54] line-clamp-1">
              {hotel.formerLife}
            </p>
          )}

          <p className="font-ui text-xs text-[#4A453E] line-clamp-3 leading-relaxed font-light">
            {hotel.description}
          </p>

          {hotel.designHighlight && (
            <div className="bg-[#FAF8F5] p-2 border border-[#EBE6DE] text-[11px] font-ui text-[#1A1814] line-clamp-2 leading-relaxed">
              <span className="text-[#9E7B54] font-medium inline-flex items-center gap-1 mr-1">
                <Sparkles className="w-2.5 h-2.5" /> Highlight:
              </span>
              {hotel.designHighlight}
            </div>
          )}
        </div>

        {/* Booking Action */}
        <div className="pt-3 border-t border-[#EFEBE4] flex items-center justify-between gap-2 mt-auto">
          <span className="text-[11px] font-ui text-[#767064] uppercase tracking-wider">
            {hotel.affiliateProvider || 'Booking'}
          </span>

          <button
            onClick={() => onBookHotel(hotel)}
            className="inline-flex items-center space-x-1 text-[11px] uppercase tracking-wider font-ui font-medium text-[#FAFAF7] bg-[#1A1814] hover:bg-[#9E7B54] px-3.5 py-1.5 transition-colors cursor-pointer"
          >
            <span>Check Rates</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

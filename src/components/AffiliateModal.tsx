import React, { useState } from 'react';
import { HotelFeature, ListItem, GearItem } from '../types';
import { X, ExternalLink, ShieldCheck, Check, Calendar, ArrowRight, Info } from 'lucide-react';

interface AffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    type: 'hotel' | 'list' | 'gear' | 'generic';
    hotel?: HotelFeature;
    listItem?: ListItem;
    gearItem?: GearItem;
    title: string;
    provider: string;
    url: string;
    price?: string;
    location?: string;
  } | null;
}

export const AffiliateModal: React.FC<AffiliateModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [checkIn, setCheckIn] = useState('2026-05-10');
  const [checkOut, setCheckOut] = useState('2026-05-14');
  const [redirecting, setRedirecting] = useState(false);

  if (!isOpen || !item) return null;

  const handleProceed = () => {
    setRedirecting(true);
    setTimeout(() => {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      setRedirecting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1814]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] w-full max-w-lg shadow-2xl overflow-hidden text-[#2D2924]">
        {/* Modal Header */}
        <div className="bg-[#F7F5F0] px-6 py-4 border-b border-[#E5E0D8] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#9E7B54]" />
            <span className="text-xs uppercase tracking-widest font-ui text-[#1A1814] font-medium">
              Vibe Routes Partner Booking
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#767064] hover:text-[#1A1814] p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#767064] font-ui block">
              Curated Selection
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-light text-[#1A1814] mt-1">
              {item.title}
            </h3>
            {item.location && (
              <p className="text-xs font-ui text-[#9E7B54] mt-1 font-medium">{item.location}</p>
            )}
          </div>

          {/* Hotel date selector simulation */}
          {item.type === 'hotel' && (
            <div className="bg-[#F7F5F0] p-4 border border-[#E5E0D8] space-y-3">
              <span className="text-xs font-ui uppercase tracking-wider text-[#1A1814] font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#9E7B54]" /> Select Travel Dates
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs font-ui">
                <div>
                  <label className="text-[#767064] block mb-1 text-[11px]">Check-In</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#D8D2C7] px-3 py-2 text-[#1A1814] focus:outline-none focus:border-[#9E7B54]"
                  />
                </div>
                <div>
                  <label className="text-[#767064] block mb-1 text-[11px]">Check-Out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#D8D2C7] px-3 py-2 text-[#1A1814] focus:outline-none focus:border-[#9E7B54]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pricing and Perks Box */}
          <div className="border border-[#E5E0D8] bg-[#FAFAF7] p-4 space-y-2 text-xs font-ui">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#767064]">Verified Partner:</span>
              <span className="font-medium text-[#1A1814]">{item.provider}</span>
            </div>
            {item.price && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#767064]">Estimated Rate:</span>
                <span className="font-display text-base font-light text-[#1A1814]">{item.price}</span>
              </div>
            )}
            <div className="pt-2 border-t border-[#E5E0D8] space-y-1 text-[#4A453E]">
              <div className="flex items-center space-x-2 text-[11px]">
                <Check className="w-3 h-3 text-[#9E7B54]" />
                <span>Best rate guarantee direct with {item.provider}</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px]">
                <Check className="w-3 h-3 text-[#9E7B54]" />
                <span>Supports independent editorial journalism at zero extra cost</span>
              </div>
            </div>
          </div>

          {/* Editorial Transparency Note */}
          <div className="flex items-start space-x-2 text-[11px] text-[#767064] font-ui leading-relaxed bg-[#F7F5F0] p-3 border border-[#E5E0D8]">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#9E7B54]" />
            <span>
              <strong className="text-[#1A1814]">Editorial Transparency:</strong> When you book through Vibe Routes affiliate links, we may earn a modest commission that funds our slow travel fieldwork in Japan, Scandinavia, and Patagonia. Our editorial curations are strictly independent.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={onClose}
              className="w-1/3 py-3 border border-[#D8D2C7] text-xs uppercase tracking-widest font-ui text-[#767064] hover:text-[#1A1814] hover:bg-[#F7F5F0] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleProceed}
              disabled={redirecting}
              className="w-2/3 py-3 bg-[#1A1814] text-[#FAFAF7] hover:bg-[#9E7B54] text-xs uppercase tracking-widest font-ui font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>{redirecting ? 'Connecting to Partner...' : `Continue to ${item.provider}`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

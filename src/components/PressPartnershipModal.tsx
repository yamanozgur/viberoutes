import React, { useState } from 'react';
import { X, Send, Check, Building, Sparkles, ShieldCheck } from 'lucide-react';

interface PressPartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PressPartnershipModal: React.FC<PressPartnershipModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [propertyType, setPropertyType] = useState('Boutique Hotel / Ryokan');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1814]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] w-full max-w-xl shadow-2xl overflow-hidden text-[#2D2924]">
        {/* Header */}
        <div className="bg-[#F7F5F0] px-6 py-4 border-b border-[#E5E0D8] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-[#9E7B54]" />
            <span className="text-xs uppercase tracking-widest font-ui text-[#1A1814] font-medium">
              Partnerships & Editorial Stays
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#767064] hover:text-[#1A1814] p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#767064] font-ui block">
              For Independent Hoteliers & Design Brands
            </span>
            <h3 className="font-display text-3xl font-light text-[#1A1814] mt-1">
              Collaborate with Vibe Routes
            </h3>
            <p className="text-xs font-ui text-[#4A453E] font-light leading-relaxed mt-2">
              We partner with independent boutique hotels, historic conversions, and sustainable design lodges that cater to discerning, cultured travelers (ages 30–55).
            </p>
          </div>

          {/* Rate Card & Partnership Packages overview */}
          <div className="bg-[#F7F5F0] p-4 border border-[#E5E0D8] space-y-2 text-xs font-ui">
            <div className="flex items-center gap-1.5 text-[#9E7B54] font-medium text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Comprehensive Media Inclusions
            </div>
            <p className="text-[#4A453E] text-[11px] leading-relaxed">
              Selected properties are featured in: 1) Dedicated long-form architectural blog review, 2) Curated editorial dispatch dossiers, 3) High-definition Pinterest & Instagram visual pins, and 4) Silent cinema video inclusion on Lumix S9.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-[#F7F5F0] border border-[#9E7B54] text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1A1814] text-[#FAFAF7] flex items-center justify-center mx-auto font-bold">
                <Check className="w-5 h-5" />
              </div>
              <h4 className="font-display text-2xl text-[#1A1814]">Inquiry Received</h4>
              <p className="text-xs font-ui text-[#767064] leading-relaxed">
                Thank you. Our editorial team will review your property's architectural profile and respond within 48 business hours with our 2026 press kit and itinerary availability.
              </p>
              <button
                onClick={onClose}
                className="mt-2 py-2 px-6 bg-[#1A1814] text-[#FAFAF7] hover:bg-[#9E7B54] text-xs uppercase tracking-widest font-ui font-medium cursor-pointer transition-colors shadow-xs"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-ui">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#767064] block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Helena Berg"
                    className="w-full bg-[#FFFFFF] border border-[#D8D2C7] px-3 py-2 text-[#1A1814] focus:outline-none focus:border-[#9E7B54]"
                  />
                </div>
                <div>
                  <label className="text-[#767064] block mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="helena@property.com"
                    className="w-full bg-[#FFFFFF] border border-[#D8D2C7] px-3 py-2 text-[#1A1814] focus:outline-none focus:border-[#9E7B54]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#767064] block mb-1">Property / Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Villa Monastero"
                    className="w-full bg-[#FFFFFF] border border-[#D8D2C7] px-3 py-2 text-[#1A1814] focus:outline-none focus:border-[#9E7B54]"
                  />
                </div>
                <div>
                  <label className="text-[#767064] block mb-1">Category</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#D8D2C7] px-3 py-2 text-[#1A1814] focus:outline-none focus:border-[#9E7B54]"
                  >
                    <option>Boutique Hotel / Ryokan</option>
                    <option>Historic Conversion Landmark</option>
                    <option>Design Lodge / Desert Sanctuary</option>
                    <option>Travel Gear / Luggage Brand</option>
                    <option>National Tourism Bureau</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#767064] block mb-1">Property Location & Architectural Character</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share a few words on the building's history, architect, and why it aligns with slow, design-conscious travel..."
                  className="w-full bg-[#FFFFFF] border border-[#D8D2C7] px-3 py-2 text-[#1A1814] focus:outline-none focus:border-[#9E7B54]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1A1814] text-[#FAFAF7] hover:bg-[#9E7B54] text-xs uppercase tracking-widest font-ui font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Partnership Proposal</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

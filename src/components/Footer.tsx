import React, { useState } from 'react';
import { MainCategory, SubCategory } from '../types';
import { Mail, Check, ArrowRight, ShieldCheck, Instagram, Youtube, Sparkles, Lock } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: MainCategory | 'all' | 'magazine' | 'routes' | 'videos', subCat?: SubCategory) => void;
  onOpenPressModal: () => void;
  onOpenVibeFinder: () => void;
  onOpenAdminPanel?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenPressModal,
  onOpenVibeFinder,
  onOpenAdminPanel,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#F2ECE4] text-[#4A453E] border-t border-[#E5E0D8] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Top Section: Brand Manifesto & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-[#D8D2C7]">
          {/* Brand Intro */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex flex-col items-start">
              <img
                src="https://github.com/yamanozgur/viberoutes/blob/7542c7d5659e5c93056b3db3537e137c76a65f44/Asset/vr.png?raw=true"
                alt="Vibe Routes Logo"
                className="h-12 sm:h-14 md:h-16 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="font-display text-xl sm:text-2xl italic font-light text-[#9E7B54] max-w-md">
              "The world is bigger than your itinerary."
            </p>

            <p className="font-ui text-xs text-[#767064] font-light max-w-md leading-relaxed">
              Hidden gems · Untravelled routes · Solo travel · Unusual experiences. An independent editorial travel & lifestyle platform bridging the gap between mass guidebooks and corporate luxury media.
            </p>

            <div className="flex items-center space-x-4 pt-2 text-xs font-ui text-[#4A453E]">
              <span className="text-[#767064]">Follow @viberoutes:</span>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#1A1814] underline underline-offset-4">Instagram</a>
              <span className="text-[#C4BCAD]">·</span>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-[#1A1814] underline underline-offset-4">Pinterest</a>
              <span className="text-[#C4BCAD]">·</span>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#1A1814] underline underline-offset-4">YouTube</a>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-6 bg-[#FFFFFF] p-6 sm:p-8 border border-[#E5E0D8] space-y-4 shadow-xs">
            <span className="text-[10px] font-ui uppercase tracking-[0.25em] text-[#767064] block">
              The Vibe Routes Dispatch
            </span>
            <h3 className="font-display text-2xl font-light text-[#1A1814]">
              Slow Travel in Your Inbox
            </h3>
            <p className="text-xs font-ui text-[#4A453E] font-light leading-relaxed">
              Join 8,000+ cultured travelers receiving our boutique hotel dossiers, essay dispatches, and curated seasonal routes.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#FAFAF7] text-xs font-ui text-[#1A1814] flex items-center gap-2 border border-[#9E7B54]">
                <Check className="w-4 h-4 text-[#9E7B54]" />
                <span>You're subscribed. The latest dispatch will arrive shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2 pt-2">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#FAFAF7] border border-[#D8D2C7] px-4 py-2.5 text-xs font-ui text-[#1A1814] placeholder-[#767064] focus:outline-none focus:border-[#9E7B54] grow"
                />
                <button
                  type="submit"
                  className="bg-[#1A1814] text-[#FAFAF7] hover:bg-[#9E7B54] text-xs uppercase tracking-widest font-ui font-medium px-5 py-2.5 transition-colors cursor-pointer shadow-xs"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-ui text-[#767064]">
          <div className="space-y-3">
            <span className="text-[#1A1814] uppercase tracking-wider text-[11px] block font-medium">Destinations</span>
            <ul className="space-y-2">
              <li><button onClick={() => onSelectCategory('destinations', 'Europe')} className="hover:text-[#1A1814] cursor-pointer">Europe</button></li>
              <li><button onClick={() => onSelectCategory('destinations', 'Asia')} className="hover:text-[#1A1814] cursor-pointer">Asia & Japan</button></li>
              <li><button onClick={() => onSelectCategory('destinations', 'Americas')} className="hover:text-[#1A1814] cursor-pointer">Americas & Patagonia</button></li>
              <li><button onClick={() => onSelectCategory('destinations', 'Middle East')} className="hover:text-[#1A1814] cursor-pointer">Middle East</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-[#1A1814] uppercase tracking-wider text-[11px] block font-medium">Stay & Boutique</span>
            <ul className="space-y-2">
              <li><button onClick={() => onSelectCategory('stay', 'Converted Buildings')} className="hover:text-[#1A1814] cursor-pointer">Converted Buildings</button></li>
              <li><button onClick={() => onSelectCategory('stay', 'Design Hotels')} className="hover:text-[#1A1814] cursor-pointer">Design Hotels</button></li>
              <li><button onClick={() => onSelectCategory('stay', 'Desert Hotels')} className="hover:text-[#1A1814] cursor-pointer">Desert Hotels</button></li>
              <li><button onClick={() => onSelectCategory('stay', 'Treehouse Hotels')} className="hover:text-[#1A1814] cursor-pointer">Treehouse Hotels</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-[#1A1814] uppercase tracking-wider text-[11px] block font-medium">Platform</span>
            <ul className="space-y-2">
              <li><button onClick={onOpenVibeFinder} className="hover:text-[#1A1814] cursor-pointer">Vibe Route Matcher</button></li>
              <li><button onClick={() => onSelectCategory('videos')} className="hover:text-[#1A1814] cursor-pointer">Silent Travel Cinema</button></li>
              <li><button onClick={() => onSelectCategory('gear', 'Luggage')} className="hover:text-[#1A1814] cursor-pointer">Luggage & Gear</button></li>
              <li><button onClick={() => onSelectCategory('experiences', 'Solo Travel')} className="hover:text-[#1A1814] cursor-pointer">Solo Travel Philosophy</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-[#1A1814] uppercase tracking-wider text-[11px] block font-medium">Editorial & Press</span>
            <ul className="space-y-2">
              <li><button onClick={onOpenPressModal} className="hover:text-[#1A1814] cursor-pointer">Hotel Partnerships</button></li>
              <li><button onClick={onOpenPressModal} className="hover:text-[#1A1814] cursor-pointer">Sponsored Stay Inquiries</button></li>
              <li><button onClick={onOpenPressModal} className="hover:text-[#1A1814] cursor-pointer">Media Kit & Rates</button></li>
              {onOpenAdminPanel && (
                <li>
                  <button 
                    onClick={onOpenAdminPanel} 
                    className="flex items-center space-x-1 text-[#9E7B54] hover:text-[#1A1814] font-medium cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Editorial Login</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Legal Affiliate Statement */}
        <div className="pt-8 border-t border-[#D8D2C7] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-ui text-[#767064]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9E7B54]" />
              <span>© 2026 Vibe Routes Platform. All rights reserved.</span>
            </div>
            {onOpenAdminPanel && (
              <button
                onClick={onOpenAdminPanel}
                className="text-[#767064] hover:text-[#1A1814] flex items-center space-x-1 cursor-pointer transition-colors text-[10px]"
                title="Editor-in-Chief Panel"
              >
                <Lock className="w-3 h-3 text-[#9E7B54]" />
                <span>Editorial Portal</span>
              </button>
            )}
          </div>

          <p className="text-center md:text-right max-w-xl text-[10px] leading-relaxed">
            Vibe Routes participates in select affiliate programs including Booking.com, Mr & Mrs Smith, Viator, and Amazon Associates. We earn a modest commission on qualified bookings made via our links with zero extra cost to readers.
          </p>
        </div>

      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { MainCategory, SubCategory } from '../types';
import { Search, Menu, X, ChevronDown, Lock } from 'lucide-react';

interface NavbarProps {
  currentCategory: MainCategory | 'all' | 'magazine' | 'routes' | 'videos';
  currentSubCategory?: SubCategory | null;
  onSelectCategory: (cat: MainCategory | 'all' | 'magazine' | 'routes' | 'videos', subCat?: SubCategory) => void;
  onOpenSearch: () => void;
  onOpenBookmarks?: () => void;
  savedCount?: number;
  onOpenVibeFinder?: () => void;
  onOpenAdminPanel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenSearch,
  onOpenAdminPanel,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuStructure = [
    {
      id: 'destinations' as MainCategory,
      label: 'Destinations',
      subcategories: ['Europe', 'Asia', 'Middle East', 'Americas', 'Africa', 'Oceania'] as SubCategory[],
    },
    {
      id: 'experiences' as MainCategory,
      label: 'Experiences',
      subcategories: ['Hidden Gems', 'Solo Travel', 'Digital Nomad', 'Train Journeys', 'UNESCO Sites'] as SubCategory[],
    },
    {
      id: 'gear' as MainCategory,
      label: 'Gear',
      subcategories: ['Luggage', 'Packing Guides'] as SubCategory[],
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E5E0D8] transition-colors">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => {
            onSelectCategory('all');
            setMobileMenuOpen(false);
          }}
          className="group text-left flex items-center cursor-pointer focus:outline-none py-1"
        >
          <img
            src="https://github.com/yamanozgur/viberoutes/blob/7542c7d5659e5c93056b3db3537e137c76a65f44/Asset/vr.png?raw=true"
            alt="Vibe Routes Logo"
            className="h-12 sm:h-14 md:h-16 w-auto object-contain hover:opacity-90 transition-all"
            referrerPolicy="no-referrer"
          />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-[13.5px] font-ui tracking-wide text-[#4A453E]">
          {menuStructure.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.id)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => onSelectCategory(item.id)}
                className={`py-2 flex items-center space-x-1 cursor-pointer transition-colors ${
                  currentCategory === item.id ? 'text-[#1A1814] font-medium underline underline-offset-8 decoration-[#1A1814]' : 'text-[#767064] hover:text-[#1A1814]'
                }`}
              >
                <span>{item.label}</span>
                <ChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </button>

              {/* Mega Dropdown */}
              {activeDropdown === item.id && (
                <div className="absolute left-0 top-full pt-1 w-52 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-[#FFFFFF] border border-[#E5E0D8] py-2 px-1 shadow-lg">
                    <button
                      onClick={() => {
                        onSelectCategory(item.id);
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs uppercase tracking-wider text-[#767064] hover:bg-[#F4EFEA] hover:text-[#1A1814] font-medium"
                    >
                      All {item.label} →
                    </button>
                    <div className="my-1 border-t border-[#E5E0D8]" />
                    {item.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          onSelectCategory(item.id, sub);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-[13px] text-[#4A453E] hover:bg-[#F4EFEA] hover:text-[#1A1814] transition-colors"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

        </nav>

        {/* Right utility buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Editorial Login Button in Top Right */}
          <button
            onClick={onOpenAdminPanel}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#9E7B54] hover:bg-[#1A1814] text-[#FAF8F5] text-xs font-ui tracking-wider uppercase transition-all cursor-pointer shadow-xs font-semibold"
            title="Editorial Login & Story Publisher"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>EDITORIAL LOGIN</span>
          </button>

          <button
            onClick={onOpenSearch}
            className="p-2 text-[#4A453E] hover:text-[#1A1814] hover:bg-[#F4EFEA] rounded-none transition-colors cursor-pointer"
            title="Search articles, guides, boutique stays..."
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1A1814] hover:bg-[#F4EFEA] cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAFAF7] border-b border-[#E5E0D8] px-6 py-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <button
            onClick={() => {
              onOpenAdminPanel();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2.5 px-3 bg-[#9E7B54] text-[#FAF8F5] flex items-center justify-between font-ui text-sm font-semibold shadow-xs"
          >
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              EDITORIAL LOGIN
            </span>
            <span>→</span>
          </button>

          <div className="space-y-4 pt-2">
            {menuStructure.map((item) => (
              <div key={item.id} className="border-b border-[#E5E0D8] pb-3">
                <button
                  onClick={() => {
                    onSelectCategory(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="text-base font-display text-[#1A1814] hover:text-[#9E7B54] font-normal w-full text-left flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="text-xs font-ui text-[#767064]">All →</span>
                </button>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        onSelectCategory(item.id, sub);
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs bg-[#FFFFFF] text-[#4A453E] hover:bg-[#1A1814] hover:text-[#FAFAF7] border border-[#E5E0D8] px-2.5 py-1 transition-colors"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>
      )}
    </header>
  );
};

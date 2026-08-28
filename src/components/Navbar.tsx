import React, { useState } from 'react';
import { MainCategory, SubCategory } from '../types';
import { Search, Menu, X, ChevronDown, Sparkles, BookOpen, Compass } from 'lucide-react';
import { getCategoryStyles } from '../utils/categoryColors';

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
      accent: 'border-[#0284C7]',
      subcategories: ['Europe', 'Middle East', 'Asia', 'Americas', 'Africa', 'Oceania'] as SubCategory[],
    },
    {
      id: 'stay' as MainCategory,
      label: 'Where to Stay',
      accent: 'border-[#D97706]',
      subcategories: ['Europe', 'Americas', 'Middle East', 'Asia'] as SubCategory[],
    },
    {
      id: 'experiences' as MainCategory,
      label: 'Experiences',
      accent: 'border-[#059669]',
      subcategories: ['Hidden Gems', 'Solo Travel', 'Digital Nomad', 'Train Journeys', 'UNESCO Sites'] as SubCategory[],
    },
    {
      id: 'lists' as MainCategory,
      label: 'The Edit',
      accent: 'border-[#EA580C]',
      subcategories: ['Europe', 'Americas', 'Hidden Gems'] as SubCategory[],
    },
    {
      id: 'the-life' as MainCategory,
      label: 'The Life',
      accent: 'border-[#7C3AED]',
      subcategories: ['Digital Nomad', 'Solo Travel'] as SubCategory[],
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E0D8] transition-colors shadow-2xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
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
            className="h-11 sm:h-13 md:h-15 w-auto object-contain hover:opacity-90 transition-all"
            referrerPolicy="no-referrer"
          />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-[13px] font-ui tracking-wide text-[#4A453E]">
          {menuStructure.map((item) => {
            const isSelected = currentCategory === item.id;
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => onSelectCategory(item.id)}
                  className={`py-2 flex items-center space-x-1 cursor-pointer transition-colors uppercase tracking-wider text-xs font-semibold ${
                    isSelected
                      ? 'text-[#1A1814] underline underline-offset-8 decoration-2 decoration-[#1A1814]'
                      : 'text-[#5C554D] hover:text-[#1A1814]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </button>

                {/* Mega Dropdown */}
                {activeDropdown === item.id && (
                  <div className="absolute left-0 top-full pt-1.5 w-56 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-[#FFFFFF] border border-[#E5E0D8] py-2 px-1 shadow-xl border-t-2 border-t-[#1A1814]">
                      <button
                        onClick={() => {
                          onSelectCategory(item.id);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-3 py-2 text-[11px] uppercase tracking-wider text-[#1A1814] hover:bg-[#FAF8F5] font-bold flex items-center justify-between"
                      >
                        <span>All {item.label}</span>
                        <span>→</span>
                      </button>
                      <div className="my-1 border-t border-[#EAE4DC]" />
                      {item.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => {
                            onSelectCategory(item.id, sub);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-[#5C554D] hover:bg-[#FAF8F5] hover:text-[#1A1814] transition-colors"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <span className="text-[#D8D2C7]">|</span>

          {/* Vibe Routes Finder */}
          <button
            onClick={() => onSelectCategory('routes')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
              currentCategory === 'routes'
                ? 'bg-[#1A1814] text-[#FAF8F5] border-[#1A1814]'
                : 'bg-[#FAF8F5] text-[#1A1814] border-[#D8D2C7] hover:border-[#1A1814]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Vibe Finder</span>
          </button>
        </nav>

        {/* Right utility buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#4A453E] hover:text-[#1A1814] hover:bg-[#FAF8F5] border border-transparent hover:border-[#E5E0D8] transition-colors cursor-pointer"
            title="Search articles, guides, boutique stays..."
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1A1814] hover:bg-[#FAF8F5] cursor-pointer border border-[#E5E0D8]"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFFFF] border-b border-[#E5E0D8] px-6 py-6 space-y-5 max-h-[85vh] overflow-y-auto">
          <div className="space-y-4">
            {menuStructure.map((item) => (
              <div key={item.id} className="border-b border-[#E5E0D8] pb-3">
                <button
                  onClick={() => {
                    onSelectCategory(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="text-base font-display text-[#1A1814] hover:text-[#9E7B54] font-medium w-full text-left flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="text-xs font-ui text-[#8C827A]">All →</span>
                </button>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        onSelectCategory(item.id, sub);
                        setMobileMenuOpen(false);
                      }}
                      className="text-xs bg-[#FAF8F5] text-[#4A453E] hover:bg-[#1A1814] hover:text-[#FAFAF7] border border-[#E5E0D8] px-2.5 py-1 transition-colors"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-2">
              <button
                onClick={() => {
                  onSelectCategory('routes');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-[#1A1814] text-[#FAF8F5] text-xs font-ui uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#D97706]" />
                <span>Open Vibe Finder</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

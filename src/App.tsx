import React, { useState, useEffect } from 'react';
import { ARTICLES_DATA } from './data/articles';
import { Article, MainCategory, SubCategory, HotelFeature, ListItem, GearItem } from './types';
import { Navbar } from './components/Navbar';
import { HeroFeatured } from './components/HeroFeatured';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';
import { EMagazineReader } from './components/EMagazineReader';
import { VibeFinder } from './components/VibeFinder';
import { VideoLounge } from './components/VideoLounge';
import { SearchModal } from './components/SearchModal';
import { BookmarkDrawer } from './components/BookmarkDrawer';
import { AffiliateModal } from './components/AffiliateModal';
import { PressPartnershipModal } from './components/PressPartnershipModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { BookOpen, Sparkles, Compass, ArrowRight, ShieldCheck, Filter, SlidersHorizontal, Check, FolderDown } from 'lucide-react';

export default function App() {
  // Articles state initialized with hardcoded and imported articles from localStorage
  const [allArticles, setAllArticles] = useState<Article[]>(() => {
    try {
      const savedCustom = localStorage.getItem('viberoutes_custom_articles') || 
                          localStorage.getItem('viberoutes_imported_articles') ||
                          localStorage.getItem('vibe_custom_articles');
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge custom articles on top of default data without duplicates
          const defaultIds = new Set(ARTICLES_DATA.map(a => a.id));
          const customFiltered = parsed.filter(a => !defaultIds.has(a.id));
          return [...customFiltered, ...ARTICLES_DATA];
        }
      }
    } catch {
      // ignore
    }
    return ARTICLES_DATA;
  });

  // Navigation & View States
  const [currentCategory, setCurrentCategory] = useState<MainCategory | 'all' | 'magazine' | 'routes' | 'videos'>('all');
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isPressModalOpen, setIsPressModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [bookingModalItem, setBookingModalItem] = useState<{
    type: 'hotel' | 'list' | 'gear' | 'generic';
    hotel?: HotelFeature;
    listItem?: ListItem;
    gearItem?: GearItem;
    title: string;
    provider: string;
    url: string;
    price?: string;
    location?: string;
  } | null>(null);

  // Bookmarking System (stored in localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('viberoutes_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('viberoutes_bookmarks', JSON.stringify(bookmarkedIds));
    } catch {
      // ignore
    }
  }, [bookmarkedIds]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddArticle = (newArticle: Article) => {
    setAllArticles((prev) => {
      const updated = [newArticle, ...prev];
      try {
        const customArticles = updated.filter((a) => a.id.startsWith('custom-article-'));
        localStorage.setItem('viberoutes_custom_articles', JSON.stringify(customArticles));
      } catch (e) {
        console.warn('Could not cache custom articles:', e);
      }
      return updated;
    });
    setSelectedArticle(newArticle);
  };

  const handleUpdateArticle = (updatedArticle: Article) => {
    setAllArticles((prev) => {
      const updated = prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a));
      try {
        const customArticles = updated.filter((a) => a.id.startsWith('custom-article-'));
        localStorage.setItem('viberoutes_custom_articles', JSON.stringify(customArticles));
      } catch (e) {
        console.warn('Could not update cached articles:', e);
      }
      return updated;
    });
    if (selectedArticle && selectedArticle.id === updatedArticle.id) {
      setSelectedArticle(updatedArticle);
    }
  };

  const handleDeleteArticle = (articleId: string) => {
    setAllArticles((prev) => {
      const updated = prev.filter((a) => a.id !== articleId);
      try {
        const customArticles = updated.filter((a) => a.id.startsWith('custom-article-'));
        localStorage.setItem('viberoutes_custom_articles', JSON.stringify(customArticles));
      } catch (e) {
        console.warn('Could not update cached articles:', e);
      }
      return updated;
    });
  };

  const handleSelectCategory = (
    cat: MainCategory | 'all' | 'magazine' | 'routes' | 'videos',
    subCat?: SubCategory
  ) => {
    setSelectedArticle(null);
    setCurrentCategory(cat);
    setCurrentSubCategory(subCat || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter articles based on category & subcategory
  const filteredArticles = allArticles.filter((art) => {
    if (currentCategory === 'all' || currentCategory === 'magazine' || currentCategory === 'routes' || currentCategory === 'videos') {
      return true;
    }
    if (currentSubCategory) {
      return art.category === currentCategory && art.subCategory === currentSubCategory;
    }
    return art.category === currentCategory;
  });

  const featuredArticle = allArticles.find((a) => a.featured) || allArticles[0];
  const popularArticles = allArticles.filter((a) => a.isPopular);
  const bookmarkedArticles = allArticles.filter((a) => bookmarkedIds.includes(a.id));

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#2D2924] flex flex-col font-ui selection:bg-[#EAE4DC] selection:text-[#1A1814]">
      {/* Universal Top Header */}
      <Navbar
        currentCategory={currentCategory}
        currentSubCategory={currentSubCategory}
        onSelectCategory={handleSelectCategory}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        savedCount={bookmarkedIds.length}
        onOpenVibeFinder={() => handleSelectCategory('routes')}
        onOpenAdminPanel={() => setIsAdminOpen(true)}
      />

      {/* Main View Router */}
      <main className="grow">
        {selectedArticle ? (
          <ArticleDetail
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
            onSelectArticle={handleSelectArticle}
            allArticles={allArticles}
            isBookmarked={bookmarkedIds.includes(selectedArticle.id)}
            onToggleBookmark={toggleBookmark}
            onOpenBookingModal={(item) => setBookingModalItem(item)}
          />
        ) : currentCategory === 'magazine' ? (
          <EMagazineReader onBackToArticles={() => handleSelectCategory('all')} />
        ) : currentCategory === 'routes' ? (
          <VibeFinder
            onSelectArticle={handleSelectArticle}
            articles={allArticles}
            onOpenBookingModal={(item) => setBookingModalItem(item)}
          />
        ) : currentCategory === 'videos' ? (
          <VideoLounge />
        ) : (
          /* Standard Editorial Home / Category View */
          <div>
            {/* If home ("all"), render the large hero cover story */}
            {currentCategory === 'all' && featuredArticle && (
              <HeroFeatured
                article={featuredArticle}
                onSelectArticle={handleSelectArticle}
                onToggleBookmark={toggleBookmark}
                isBookmarked={bookmarkedIds.includes(featuredArticle.id)}
              />
            )}

            {/* Category Page Title Banner (When filtered) */}
            {currentCategory !== 'all' && (
              <div className="border-b border-[#E5E0D8] bg-[#F4EFEA] py-10 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.25em] font-ui text-[#767064] block">
                      Curated Category
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl font-light text-[#1A1814] capitalize mt-1">
                      {currentSubCategory ? `${currentSubCategory}` : `${currentCategory.replace('-', ' ')}`}
                    </h1>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-ui text-[#767064]">
                    <span>{filteredArticles.length} Stories Available</span>
                  </div>
                </div>
              </div>
            )}

            {/* Curated Feed Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-16">
              
              {/* Secondary Editorial Filter Pills (Subcategories) */}
              {currentCategory !== 'all' && (
                <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#E5E0D8]">
                  <button
                    onClick={() => setCurrentSubCategory(null)}
                    className={`px-3.5 py-1.5 text-xs font-ui uppercase tracking-wider transition-all cursor-pointer ${
                      currentSubCategory === null
                        ? 'bg-[#1A1814] text-[#FAFAF7] font-medium'
                        : 'bg-[#FFFFFF] text-[#767064] hover:text-[#1A1814] border border-[#E5E0D8]'
                    }`}
                  >
                    All {currentCategory}
                  </button>
                </div>
              )}

              {/* Grid of Main Articles */}
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                  <h2 className="font-display text-2xl sm:text-3xl font-light text-[#1A1814]">
                    {currentCategory === 'all' ? 'Latest Stories & Guides' : `Field Reports`}
                  </h2>
                  <span className="text-xs font-ui text-[#767064]">Updated February 2026</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles.map((art) => (
                    <ArticleCard
                      key={art.id}
                      article={art}
                      onSelectArticle={handleSelectArticle}
                      onToggleBookmark={toggleBookmark}
                      isBookmarked={bookmarkedIds.includes(art.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Popular Stays & Lists Strip */}
              {currentCategory === 'all' && (
                <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-ui text-[#767064] block">Editor’s Selection</span>
                      <h3 className="font-display text-2xl font-light text-[#1A1814]">Essential Slow Travel Reads</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {popularArticles.slice(0, 2).map((pop) => (
                      <ArticleCard
                        key={pop.id}
                        article={pop}
                        onSelectArticle={handleSelectArticle}
                        onToggleBookmark={toggleBookmark}
                        isBookmarked={bookmarkedIds.includes(pop.id)}
                        layout="horizontal"
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </main>

      {/* Universal Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenPressModal={() => setIsPressModalOpen(true)}
        onOpenVibeFinder={() => handleSelectCategory('routes')}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={allArticles}
        onSelectArticle={handleSelectArticle}
      />

      {/* Saved Bookmarks Drawer */}
      <BookmarkDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        savedArticles={bookmarkedArticles}
        onSelectArticle={handleSelectArticle}
        onRemoveBookmark={toggleBookmark}
        onClearAll={() => setBookmarkedIds([])}
      />

      {/* Affiliate Booking Dispatch Modal */}
      <AffiliateModal
        isOpen={!!bookingModalItem}
        onClose={() => setBookingModalItem(null)}
        item={bookingModalItem}
      />

      {/* Press & Hotel Partnerships Modal */}
      <PressPartnershipModal
        isOpen={isPressModalOpen}
        onClose={() => setIsPressModalOpen(false)}
      />

      {/* Admin Panel Story Publisher */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        articles={allArticles}
        onAddArticle={handleAddArticle}
        onUpdateArticle={handleUpdateArticle}
        onDeleteArticle={handleDeleteArticle}
        onSelectArticle={handleSelectArticle}
      />
    </div>
  );
}

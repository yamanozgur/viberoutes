import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Article, HotelFeature, ListItem, GearItem } from '../types';
import { HotelFeatureCard } from './HotelFeatureCard';
import { 
  ArrowLeft, Bookmark, Share2, Clock, Volume2, VolumeX, 
  MapPin, Check, ExternalLink, Sparkles, Compass, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { ambientAudio } from '../utils/audio';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  allArticles: Article[];
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  onOpenBookingModal: (bookingItem: {
    type: 'hotel' | 'list' | 'gear' | 'generic';
    hotel?: HotelFeature;
    listItem?: ListItem;
    gearItem?: GearItem;
    title: string;
    provider: string;
    url: string;
    price?: string;
    location?: string;
  }) => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onBack,
  onSelectArticle,
  allArticles = [],
  isBookmarked,
  onToggleBookmark,
  onOpenBookingModal,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  if (!article) return null;

  const relatedArticles = (allArticles || [])
    .filter((a) => a && a.id !== article.id && (a.category === article.category || a.subCategory === article.subCategory))
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const toggleSoundtrack = () => {
    if (isAudioPlaying) {
      ambientAudio.stop();
      setIsAudioPlaying(false);
    } else {
      ambientAudio.play(article.ambientSoundtrack?.type || 'rain');
      setIsAudioPlaying(true);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
    }
  };

  return (
    <article className="bg-[#FAFAF7] min-h-screen text-[#2D2924]">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-[#E5E0D8] bg-[#FAFAF7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs uppercase tracking-widest font-ui text-[#767064] hover:text-[#1A1814] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Stories</span>
          </button>

          <div className="flex items-center space-x-3 text-xs font-ui text-[#767064]">
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 hover:text-[#1A1814] p-1.5 border border-[#E5E0D8] bg-[#FFFFFF] cursor-pointer"
              title="Copy share link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedShare ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`flex items-center space-x-1 p-1.5 border transition-colors cursor-pointer ${
                isBookmarked ? 'bg-[#1A1814] text-[#FAFAF7] border-[#1A1814]' : 'border-[#E5E0D8] bg-[#FFFFFF] hover:text-[#1A1814]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-8 space-y-6">
        <div className="flex items-center space-x-3 text-xs uppercase tracking-[0.25em] font-ui text-[#767064]">
          <span className="text-[#1A1814] font-medium">{article.category}</span>
          <span className="text-[#C4BCAD]">/</span>
          <span>{article.subCategory}</span>
          <span className="text-[#C4BCAD]">/</span>
          <span className="text-[#9E7B54] font-medium">{article.region}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-light text-[#1A1814] leading-[1.12] tracking-tight">
          {article.title}
        </h1>

        <p className="font-display text-xl sm:text-2xl italic text-[#9E7B54] font-light leading-relaxed">
          {article.subtitle}
        </p>

        {/* Metadata & Author Bar */}
        <div className="pt-6 border-t border-[#E5E0D8] flex flex-wrap items-center justify-between gap-4 text-xs font-ui text-[#767064]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#EBE5DC] border border-[#D8D2C7] flex items-center justify-center font-display text-sm text-[#1A1814]">
              {article.author.name.charAt(0)}
            </div>
            <div>
              <span className="text-[#1A1814] font-medium block">{article.author.name}</span>
              <span className="text-[11px] text-[#767064]">{article.author.role} · {article.publishedDate}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </span>

            {article.ambientSoundtrack && (
              <button
                onClick={toggleSoundtrack}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FFFFFF] border border-[#E5E0D8] text-[#1A1814] hover:bg-[#1A1814] hover:text-[#FAFAF7] transition-all cursor-pointer shadow-xs"
              >
                {isAudioPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#9E7B54] animate-pulse" />
                    <span>Ambience: Playing</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Atmospheric Audio</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Cover Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
        <div className="aspect-[16/9] sm:aspect-[21/10] overflow-hidden bg-[#F4EFEA] border border-[#E5E0D8] shadow-xs">
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-2 text-right text-[11px] font-ui text-[#767064] italic">
          Photographed for Vibe Routes Archive · {article.region}
        </div>
      </div>

      {/* Article Body Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Drop Cap Intro Paragraph */}
        {article.introParagraph && (
          <div className="prose-editorial mb-8">
            <div className="text-base sm:text-[17px] leading-[1.95] text-[#2D2924] first-letter:font-display first-letter:text-6xl first-letter:float-left first-letter:mr-3.5 first-letter:leading-none first-letter:font-light first-letter:text-[#1A1814]">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <span>{children}</span>,
                  strong: ({ children }) => <strong className="font-semibold text-[#1A1814]">{children}</strong>,
                  em: ({ children }) => <em className="italic text-[#2D2924]">{children}</em>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9E7B54] underline hover:text-[#1A1814] transition-colors"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {article.introParagraph}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Content Sections */}
        {article.sections.map((sec, idx) => (
          <div key={idx} className="my-8 prose-editorial">
            {sec.heading && (
              <h2 className="font-display text-2xl sm:text-3xl font-light text-[#1A1814] tracking-tight border-b border-[#E5E0D8] pb-3 mb-6">
                {sec.heading}
              </h2>
            )}

            {sec.paragraphs.map((p, pIdx) => (
              <div
                key={pIdx}
                className="text-base sm:text-[16.5px] text-[#2D2924] font-normal leading-[1.95] mb-6 tracking-[-0.005em]"
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-0 leading-[1.95]">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-[#1A1814]">{children}</strong>,
                    em: ({ children }) => <em className="italic font-reading text-[#2D2924]">{children}</em>,
                    h2: ({ children }) => (
                      <h2 className="font-display text-2xl sm:text-3xl font-light text-[#1A1814] tracking-tight mt-8 mb-4 border-b border-[#E5E0D8] pb-2">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="font-display text-xl sm:text-2xl font-light text-[#1A1814] mt-6 mb-3">
                        {children}
                      </h3>
                    ),
                    ul: ({ children }) => <ul className="list-disc list-outside pl-5 my-4 space-y-2 text-[#2D2924]">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-outside pl-5 my-4 space-y-2 text-[#2D2924]">{children}</ol>,
                    li: ({ children }) => <li className="leading-[1.8]">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="my-6 border-l-2 border-[#9E7B54] pl-5 py-1.5 bg-[#FAF7F2] text-[#4A453E] italic">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#9E7B54] font-medium underline underline-offset-4 decoration-[#9E7B54]/40 hover:text-[#1A1814] hover:decoration-[#1A1814] transition-colors"
                      >
                        {children}
                      </a>
                    ),
                    hr: () => <hr className="my-8 border-[#E5E0D8]" />,
                  }}
                >
                  {p}
                </ReactMarkdown>
              </div>
            ))}

            {sec.quote && (
              <blockquote className="my-8 border-l-2 border-[#9E7B54] pl-6 py-2 bg-[#F9F7F4]">
                <p className="font-display text-xl sm:text-2xl italic font-light text-[#1A1814] leading-relaxed">
                  "{sec.quote}"
                </p>
              </blockquote>
            )}

            {sec.image && (
              <figure className="my-8">
                <div className="aspect-[16/10] overflow-hidden bg-[#F4EFEA] border border-[#E5E0D8]">
                  <img
                    src={sec.image.url}
                    alt={sec.image.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-xs font-ui text-[#767064] flex justify-between">
                  <span>{sec.image.caption}</span>
                  {sec.image.credit && <span className="italic">{sec.image.credit}</span>}
                </figcaption>
              </figure>
            )}
          </div>
        ))}

        {/* Hotel Stay Series Section (If Present) */}
        {article.hotelData && article.hotelData.length > 0 && (
          <div className="my-12 pt-8 border-t border-[#E5E0D8]">
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest font-ui text-[#767064] block">
                The Curated Accommodation Series
              </span>
              <h2 className="font-display text-3xl font-light text-[#1A1814] mt-1">
                Featured Boutique Stays
              </h2>
              <p className="text-sm font-ui text-[#767064] mt-1">
                Independent properties selected for architectural merit, sensory texture, and exceptional hospitality.
              </p>
            </div>

            <div className="space-y-8">
              {article.hotelData.map((hotel, hIdx) => (
                <HotelFeatureCard
                  key={hotel.name}
                  hotel={hotel}
                  index={hIdx}
                  onBookHotel={(h) =>
                    onOpenBookingModal({
                      type: 'hotel',
                      hotel: h,
                      title: h.name,
                      provider: h.affiliateProvider,
                      url: h.affiliateUrl,
                      price: h.priceStarting,
                      location: h.location,
                    })
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Top 10 / 20 List Items Section (If Present) */}
        {article.listItems && article.listItems.length > 0 && (
          <div className="my-12 pt-8 border-t border-[#E5E0D8]">
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest font-ui text-[#767064] block">
                Curated Selection
              </span>
              <h2 className="font-display text-3xl font-light text-[#1A1814] mt-1">
                The Definitive Rankings
              </h2>
            </div>

            <div className="space-y-8">
              {article.listItems.map((item) => (
                <div key={item.rank} className="border border-[#E5E0D8] bg-[#FFFFFF] p-6 sm:p-7 space-y-4 shadow-xs">
                  <div className="flex items-baseline justify-between border-b border-[#E5E0D8] pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-display text-3xl font-light text-[#1A1814]">
                        #{item.rank}
                      </span>
                      <div>
                        <h3 className="font-display text-2xl font-light text-[#1A1814]">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <span className="text-xs font-display italic text-[#9E7B54]">
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-ui text-[#767064] uppercase tracking-wider">{item.location}</span>
                  </div>

                  <div className="aspect-[16/9] overflow-hidden bg-[#F4EFEA]">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-sm font-ui text-[#38342D] font-light leading-[1.85]">
                    {item.description}
                  </p>

                  <div className="bg-[#F7F5F0] p-4 border border-[#E5E0D8] space-y-2 text-xs font-ui">
                    <div>
                      <span className="text-[#1A1814] font-medium">Why It’s Special: </span>
                      <span className="text-[#4A453E]">{item.whySpecial}</span>
                    </div>
                    <div>
                      <span className="text-[#1A1814] font-medium">Insider Note: </span>
                      <span className="text-[#4A453E] italic">"{item.insiderTip}"</span>
                    </div>
                  </div>

                  {item.affiliateLink && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() =>
                          onOpenBookingModal({
                            type: 'list',
                            listItem: item,
                            title: item.title,
                            provider: item.affiliateLink!.provider,
                            url: item.affiliateLink!.url,
                            price: item.affiliateLink!.price,
                            location: item.location,
                          })
                        }
                        className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-ui font-medium text-[#FAFAF7] bg-[#1A1814] hover:bg-[#9E7B54] px-5 py-2.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>{item.affiliateLink.text}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gear Reviews Section (If Present) */}
        {article.gearData && article.gearData.length > 0 && (
          <div className="my-12 pt-8 border-t border-[#E5E0D8]">
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest font-ui text-[#767064] block">
                Industrial Design & Craft
              </span>
              <h2 className="font-display text-3xl font-light text-[#1A1814] mt-1">
                Evaluated Luggage & Gear
              </h2>
            </div>

            <div className="space-y-8">
              {article.gearData.map((gear, gIdx) => (
                <div key={gIdx} className="border border-[#E5E0D8] bg-[#FFFFFF] grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden shadow-xs">
                  <div className="md:col-span-5 aspect-[4/3] md:aspect-auto overflow-hidden bg-[#F4EFEA]">
                    <img
                      src={gear.imageUrl}
                      alt={gear.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-7 p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[11px] font-ui uppercase tracking-widest text-[#767064]">{gear.brand}</span>
                        <span className="font-display text-xl font-light text-[#1A1814]">{gear.price}</span>
                      </div>
                      <h3 className="font-display text-2xl font-light text-[#1A1814]">
                        {gear.name}
                      </h3>
                      <p className="text-xs font-ui text-[#4A453E] font-light leading-relaxed">
                        {gear.verdict}
                      </p>

                      <div className="text-[11px] font-ui text-[#767064] space-y-1">
                        <div>Dimensions: {gear.dimensions} · Weight: {gear.weight}</div>
                        <ul className="list-disc pl-4 space-y-0.5 text-[#4A453E]">
                          {gear.pros.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E5E0D8] flex justify-end">
                      <button
                        onClick={() =>
                          onOpenBookingModal({
                            type: 'gear',
                            gearItem: gear,
                            title: `${gear.brand} ${gear.name}`,
                            provider: gear.affiliateProvider,
                            url: gear.affiliateUrl,
                            price: gear.price,
                          })
                        }
                        className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-ui font-medium text-[#FAFAF7] bg-[#1A1814] hover:bg-[#9E7B54] px-5 py-2.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Check Price on {gear.affiliateProvider}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Standard Editorial Close as defined in Strategy Doc 3.3 */}
        {article.conclusion && (
          <div className="my-10 p-6 bg-[#F7F5F0] border-l-2 border-[#9E7B54]">
            <span className="text-[10px] font-ui uppercase tracking-widest text-[#767064] block font-medium">Editorial Imperative</span>
            <p className="font-display text-lg italic text-[#1A1814] mt-1 font-light leading-relaxed">
              {article.conclusion}
            </p>
          </div>
        )}

        {/* Tags */}
        <div className="py-6 border-t border-b border-[#E5E0D8] flex flex-wrap gap-2 items-center">
          <span className="text-xs font-ui text-[#767064] uppercase tracking-wider mr-2">Tags:</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-ui bg-[#FFFFFF] text-[#4A453E] px-3 py-1 border border-[#E5E0D8]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Ethical Affiliate Disclaimer */}
        {article.affiliateDisclaimer && (
          <div className="my-8 p-4 bg-[#F7F5F0] border border-[#E5E0D8] text-xs font-ui text-[#767064] leading-relaxed flex items-start space-x-3">
            <ShieldCheck className="w-4 h-4 text-[#9E7B54] mt-0.5 shrink-0" />
            <div>
              <strong className="text-[#1A1814] font-medium">Affiliate Disclosure:</strong> Vibe Routes partners with Booking.com, Mr & Mrs Smith, Viator, and select design gear makers. When you book a room or acquire recommended travel tools through our links, we may receive a commission at no additional cost to you. This directly funds our on-the-ground slow reporting and high-production photography.
            </div>
          </div>
        )}

        {/* Monthly Dispatch Newsletter CTA */}
        <div className="my-12 p-8 bg-[#F7F5F0] border border-[#E2DDD5] space-y-4 text-center shadow-xs">
          <span className="text-[11px] uppercase tracking-[0.25em] font-ui text-[#767064] block">
            The Vibe Routes Dispatch
          </span>
          <h3 className="font-display text-3xl font-light text-[#1A1814]">
            Receive Slow Travel Field Notes in Your Inbox
          </h3>
          <p className="text-sm font-ui text-[#4A453E] font-light max-w-md mx-auto leading-relaxed">
            In-depth architecture essays, boutique hotel dossiers, and curated travel routes.
          </p>

          {newsletterSubscribed ? (
            <div className="p-3 bg-[#FFFFFF] border border-[#9E7B54] text-xs font-ui text-[#1A1814] flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-[#9E7B54]" /> Thank you. You are now subscribed to the dispatch.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-[#FFFFFF] border border-[#D8D2C7] px-4 py-3 text-xs font-ui text-[#1A1814] placeholder-[#767064] focus:outline-none focus:border-[#9E7B54] grow"
              />
              <button
                type="submit"
                className="bg-[#1A1814] text-[#FAFAF7] hover:bg-[#9E7B54] text-xs uppercase tracking-widest font-ui font-medium px-6 py-3 transition-colors cursor-pointer shadow-xs"
              >
                Join
              </button>
            </form>
          )}
        </div>

        {/* Related Stories */}
        {relatedArticles.length > 0 && (
          <div className="my-16 pt-10 border-t border-[#E5E0D8]">
            <h3 className="font-display text-2xl font-light text-[#1A1814] mb-6">
              Continue Reading
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onSelectArticle(rel);
                  }}
                  className="group cursor-pointer space-y-2.5"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#F4EFEA] border border-[#E5E0D8]">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[10px] font-ui uppercase tracking-wider text-[#767064] block">
                    {rel.subCategory}
                  </span>
                  <h4 className="font-display text-lg font-light text-[#1A1814] group-hover:text-[#9E7B54] transition-colors leading-snug line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

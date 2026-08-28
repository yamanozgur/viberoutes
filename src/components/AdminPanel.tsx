import React, { useState, useRef } from 'react';
import { Article, MainCategory, SubCategory } from '../types';
import { parseDocxFile, ParsedDocxResult } from '../utils/docxImporter';
import { normalizeUnsplashUrl } from '../utils/unsplash';
import {
  FileText,
  Upload,
  Check,
  X,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  User,
  MapPin,
  Trash2,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onAddArticle: (article: Article) => void;
  onUpdateArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onSelectArticle: (article: Article) => void;
}

const CATEGORIES: { id: MainCategory; label: string }[] = [
  { id: 'destinations', label: 'Destinations' },
  { id: 'stay', label: 'Stay' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'lists', label: 'Lists' },
  { id: 'gear', label: 'Gear' },
  { id: 'the-life', label: 'The Life' },
];

const SUBCATEGORIES: SubCategory[] = [
  'Europe',
  'Asia',
  'Americas',
  'Middle East',
  'Africa',
  'Oceania',
  'Hidden Gems',
  'Design Hotels',
  'Solo Travel',
  'Digital Nomad',
  'Train Journeys',
  'Best Of',
  'Cultural Essays',
];

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=1600&q=80';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  articles,
  onAddArticle,
  onDeleteArticle,
  onSelectArticle,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'articles'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Parsed Draft from uploaded Docx
  const [parsedData, setParsedData] = useState<ParsedDocxResult | null>(null);
  const [fileName, setFileName] = useState('');
  
  // Editable fields before publish
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<MainCategory>('destinations');
  const [subCategory, setSubCategory] = useState<SubCategory>('Europe');
  const [region, setRegion] = useState('Global Route');
  const [authorName, setAuthorName] = useState('Özgür Yaman');
  const [authorRole, setAuthorRole] = useState('Editor-in-Chief & Founder');
  const [coverUrl, setCoverUrl] = useState(DEFAULT_COVER);
  const [customUnsplashUrl, setCustomUnsplashUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.docx') && !file.name.toLowerCase().endsWith('.doc')) {
      setErrorMessage('Lütfen geçerli bir Microsoft Word (.docx) dosyası yükleyin.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const parsed = await parseDocxFile(file);
      setParsedData(parsed);
      setFileName(file.name);
      
      // Auto fill form values
      setTitle(parsed.title);
      setSubtitle(parsed.subtitle);
      if (parsed.detectedAuthor) setAuthorName(parsed.detectedAuthor);
      if (parsed.detectedRegion) setRegion(parsed.detectedRegion);
      if (parsed.extractedCoverUrl) {
        setCoverUrl(parsed.extractedCoverUrl);
      } else {
        setCoverUrl(DEFAULT_COVER);
      }

      setSuccessMessage(`"${file.name}" başarıyla çözümlendi!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Docx parse error:', err);
      setErrorMessage('Word dosyası okunurken bir hata oluştu. Lütfen dosyanın .docx formatında olduğundan emin olun.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
  };

  const handleApplyUnsplash = () => {
    if (!customUnsplashUrl.trim()) return;
    const normalized = normalizeUnsplashUrl(customUnsplashUrl.trim());
    setCoverUrl(normalized);
    setCustomUnsplashUrl('');
  };

  const handlePublish = () => {
    if (!parsedData || !title.trim()) return;

    const readTimeMinutes = Math.max(3, Math.ceil(parsedData.wordCount / 180));
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `story-${Date.now()}`;

    const newArticle: Article = {
      id: `article-docx-${Date.now()}`,
      slug: slug,
      title: title.trim(),
      subtitle: subtitle.trim() || parsedData.intro.slice(0, 160) + '...',
      category: category,
      subCategory: subCategory,
      region: region.trim() || 'Europe',
      coverImage: coverUrl,
      author: {
        name: authorName.trim() || 'Özgür Yaman',
        role: authorRole.trim() || 'Editor-in-Chief & Founder',
      },
      publishedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      readTime: `${readTimeMinutes} min read`,
      excerpt: (subtitle || parsedData.intro).slice(0, 180) + '...',
      introParagraph: parsedData.intro,
      sections: parsedData.sections,
      tags: [subCategory, region, 'Editorial', 'Word Import'],
      featured: true,
      isEditorPick: true,
      affiliateDisclaimer: true,
    };

    onAddArticle(newArticle);
    setSuccessMessage('Yazınız başarıyla yayına alındı!');
    
    setTimeout(() => {
      onClose();
      onSelectArticle(newArticle);
    }, 800);
  };

  const handleReset = () => {
    setParsedData(null);
    setFileName('');
    setTitle('');
    setSubtitle('');
    setCoverUrl(DEFAULT_COVER);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1814]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#E5E0D8] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#2D2924]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FFFFFF] border-b border-[#E8E3DA] flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#D8D2C7] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#9E7B54]" />
            </div>
            <div>
              <span className="text-[11px] font-ui uppercase tracking-[0.25em] text-[#8C827A] block font-semibold">
                EDITORIAL DESK
              </span>
              <h3 className="font-display text-2xl font-light text-[#1A1814]">
                Word Dosyası ile Yazı Yükleme
              </h3>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-3">
            <div className="flex bg-[#EFEAE2] p-1 border border-[#DCD5C9]">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1.5 text-xs font-ui transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                  activeTab === 'upload'
                    ? 'bg-[#FFFFFF] text-[#1A1814] shadow-xs'
                    : 'text-[#767064] hover:text-[#1A1814]'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-[#9E7B54]" />
                <span>Word Yükle</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('articles')}
                className={`px-3 py-1.5 text-xs font-ui transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                  activeTab === 'articles'
                    ? 'bg-[#FFFFFF] text-[#1A1814] shadow-xs'
                    : 'text-[#767064] hover:text-[#1A1814]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Yazılar ({articles.length})</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#767064] hover:text-[#1A1814] hover:bg-[#EFEAE2] rounded-xs transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grow overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#FAF8F5]">
          {errorMessage && (
            <div className="p-4 bg-[#FDF2F2] border border-[#F8B4B4] text-xs font-ui text-[#9B1C1C] flex items-center gap-2 rounded-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-[#F2F7F2] border border-[#B7DDB7] text-xs font-ui text-[#1E4620] flex items-center gap-2 rounded-xs">
              <Check className="w-4 h-4 text-[#2E7D32] shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* TAB 1: WORD UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {!parsedData ? (
                /* Upload Area */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-all duration-200 bg-[#FFFFFF] ${
                    isDragging
                      ? 'border-[#9E7B54] bg-[#FAF6F0]'
                      : 'border-[#D8D2C7] hover:border-[#9E7B54] hover:bg-[#FCFAF7]'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".docx,.doc"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FAF6F0] border border-[#E5E0D8] flex items-center justify-center text-[#9E7B54]">
                    {isProcessing ? (
                      <RefreshCw className="w-7 h-7 animate-spin" />
                    ) : (
                      <Upload className="w-7 h-7" />
                    )}
                  </div>

                  <h4 className="font-display text-xl font-medium text-[#1A1814] mb-2">
                    {isProcessing ? 'Word Dosyası Okunuyor...' : 'Word (.docx) Dosyanızı Buraya Sürükleyin'}
                  </h4>

                  <p className="text-xs font-ui text-[#767064] max-w-md mx-auto mb-5 leading-relaxed">
                    Yazınızın başlığı, alt başlığı, paragrafları ve Word içine eklediğiniz Unsplash linkleri otomatik olarak dergi düzenine dönüştürülür.
                  </p>

                  <button
                    type="button"
                    disabled={isProcessing}
                    className="px-6 py-2.5 bg-[#1A1814] hover:bg-[#9E7B54] text-[#FFFFFF] text-xs font-ui uppercase tracking-widest font-medium transition-colors inline-flex items-center space-x-2 shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Bilgisayardan Dosya Seç</span>
                  </button>
                </div>
              ) : (
                /* Parsed Word Preview & Publish Screen */
                <div className="space-y-6 animate-in fade-in">
                  {/* File parsed banner */}
                  <div className="p-4 bg-[#FFFFFF] border border-[#E5E0D8] flex items-center justify-between shadow-2xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-[#FAF6F0] text-[#9E7B54] flex items-center justify-center border border-[#E5E0D8]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-ui uppercase tracking-wider text-[#9E7B54] font-semibold block">
                          YÜKLENEN DOSYA
                        </span>
                        <span className="font-ui text-sm font-medium text-[#1A1814]">
                          {fileName}
                        </span>
                        <span className="text-xs font-ui text-[#767064] ml-2">
                          ({parsedData.wordCount} kelime · {parsedData.sections.length} bölüm)
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs font-ui text-[#767064] hover:text-[#1A1814] underline cursor-pointer"
                    >
                      Farklı Dosya Yükle
                    </button>
                  </div>

                  {/* Editable Details Box */}
                  <div className="bg-[#FFFFFF] p-6 border border-[#E5E0D8] space-y-5 shadow-2xs">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      
                      {/* Cover Photo */}
                      <div className="md:col-span-4 space-y-3">
                        <label className="text-xs font-ui font-semibold uppercase tracking-wider text-[#4A453E] block">
                          Kapak Fotoğrafı
                        </label>
                        <div className="aspect-[16/10] bg-[#EFEAE2] border border-[#D8D2C7] overflow-hidden">
                          <img
                            src={coverUrl}
                            alt="Cover Preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-ui text-[#767064] block mb-1">
                            Farklı Unsplash Linki Yapıştır:
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="url"
                              placeholder="https://unsplash.com/photos/..."
                              value={customUnsplashUrl}
                              onChange={(e) => setCustomUnsplashUrl(e.target.value)}
                              className="grow bg-[#FAFAF8] border border-[#D5CFC5] px-2.5 py-1.5 text-xs font-ui text-[#1A1814] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleApplyUnsplash}
                              className="px-3 py-1.5 bg-[#1A1814] hover:bg-[#9E7B54] text-[#FFFFFF] text-xs font-ui cursor-pointer transition-colors"
                            >
                              Uygula
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="md:col-span-8 space-y-4">
                        <div>
                          <label className="text-xs font-ui font-semibold uppercase tracking-wider text-[#4A453E] block mb-1">
                            Yazı Başlığı
                          </label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-2 font-display text-lg text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-ui font-semibold uppercase tracking-wider text-[#4A453E] block mb-1">
                            Alt Başlık / Özet
                          </label>
                          <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-1.5 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                          />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[11px] font-ui text-[#767064] block mb-1">
                              Kategori
                            </label>
                            <select
                              value={category}
                              onChange={(e) => setCategory(e.target.value as MainCategory)}
                              className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-2.5 py-1.5 text-xs font-ui text-[#1A1814]"
                            >
                              {CATEGORIES.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-ui text-[#767064] block mb-1">
                              Bölge / Konu
                            </label>
                            <select
                              value={subCategory}
                              onChange={(e) => setSubCategory(e.target.value as SubCategory)}
                              className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-2.5 py-1.5 text-xs font-ui text-[#1A1814]"
                            >
                              {SUBCATEGORIES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-ui text-[#767064] block mb-1">
                              Şehir / Ülke
                            </label>
                            <input
                              type="text"
                              value={region}
                              onChange={(e) => setRegion(e.target.value)}
                              className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-2.5 py-1.5 text-xs font-ui text-[#1A1814]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="text-[11px] font-ui text-[#767064] block mb-1">
                              Yazar Adı
                            </label>
                            <input
                              type="text"
                              value={authorName}
                              onChange={(e) => setAuthorName(e.target.value)}
                              className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-2.5 py-1.5 text-xs font-ui text-[#1A1814]"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-ui text-[#767064] block mb-1">
                              Yazar Unvanı
                            </label>
                            <input
                              type="text"
                              value={authorRole}
                              onChange={(e) => setAuthorRole(e.target.value)}
                              className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-2.5 py-1.5 text-xs font-ui text-[#1A1814]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Publish Action Button */}
                    <div className="pt-4 border-t border-[#EFEAE2]">
                      <button
                        type="button"
                        onClick={handlePublish}
                        className="w-full py-4 bg-[#1A1814] hover:bg-[#9E7B54] text-[#FFFFFF] text-sm font-ui uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
                      >
                        <Sparkles className="w-4 h-4 text-[#C9A882]" />
                        <span>Yazıyı Yayına Al ve Sayfayı Aç</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ARTICLES LIST & MANAGEMENT */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-ui text-[#767064]">
                  Toplam {articles.length} yayında yazı bulunuyor.
                </span>
              </div>

              <div className="space-y-3">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 bg-[#FFFFFF] border border-[#E5E0D8] flex items-center justify-between gap-4 shadow-2xs hover:border-[#9E7B54]/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="w-16 h-12 bg-[#EFEAE2] shrink-0 overflow-hidden border border-[#E5E0D8]">
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-display text-base font-medium text-[#1A1814] truncate">
                          {art.title}
                        </h4>
                        <div className="flex items-center space-x-3 text-xs font-ui text-[#767064]">
                          <span>{art.author.name}</span>
                          <span>•</span>
                          <span>{art.category}</span>
                          <span>•</span>
                          <span>{art.readTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectArticle(art);
                        }}
                        className="p-2 text-[#767064] hover:text-[#1A1814] hover:bg-[#FAF6F0] rounded-xs transition-colors cursor-pointer"
                        title="Yazıyı Oku"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteArticle(art.id)}
                        className="p-2 text-[#C0392B] hover:bg-[#FDF2F2] rounded-xs transition-colors cursor-pointer"
                        title="Yazıyı Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

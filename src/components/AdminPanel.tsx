import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Article, MainCategory, SubCategory } from '../types';
import { normalizeUnsplashUrl, parseDraftWithUnsplash } from '../utils/unsplash';
import {
  PenTool,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  Upload,
  Eye,
  BookOpen,
  MapPin,
  Layers,
  Edit3,
  RotateCcw,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link,
  Minus,
  Sparkles,
  User,
  Copy,
  FileText,
  ExternalLink,
  Code
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

const CATEGORY_OPTIONS: { id: MainCategory; label: string }[] = [
  { id: 'destinations', label: 'Destinations' },
  { id: 'stay', label: 'Stay' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'lists', label: 'Lists' },
  { id: 'gear', label: 'Gear' },
  { id: 'the-life', label: 'The Life' },
];

const SUBCATEGORY_OPTIONS: SubCategory[] = [
  'Europe',
  'Asia',
  'Middle East',
  'Africa',
  'Americas',
  'Oceania',
  'Hidden Gems',
  'Solo Travel',
  'Digital Nomad',
  'Train Journeys',
  'UNESCO Sites',
  'Design Hotels',
  'Treehouse Hotels',
  'Desert Hotels',
  'Infinity Pools',
  'Converted Buildings',
  'Instagram Spots',
  'Best Of',
  'Seasonal Guides',
  'Luggage',
  'Packing Guides',
  'Nomad Life',
  'Solo Travel Philosophy',
  'Cultural Essays',
];

const PRESET_PHOTOS = [
  {
    label: 'Dublin Heritage',
    url: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Kyoto Sanctuary',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Tuscan Countryside',
    url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Amalfi Coastline',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Alpine Retreat',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Parisian Architecture',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
  },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  articles,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
  onSelectArticle,
}) => {
  const [activeTab, setActiveTab] = useState<'importer' | 'create' | 'manage'>('importer');
  const [editorTab, setEditorTab] = useState<'edit' | 'preview'>('edit');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<MainCategory>('destinations');
  const [subCategory, setSubCategory] = useState<SubCategory>('Europe');
  const [region, setRegion] = useState('');
  const [authorName, setAuthorName] = useState('Özgür Yaman');
  const [authorRole, setAuthorRole] = useState('Editor-in-Chief & Founder');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=1600&q=80'
  );
  const [unsplashInput, setUnsplashInput] = useState('');
  const [fullArticleText, setFullArticleText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Raw Word / Draft Importer State
  const [rawDraftText, setRawDraftText] = useState('');
  const [importCoverUrl, setImportCoverUrl] = useState('');
  const [parsedPreview, setParsedPreview] = useState<ReturnType<typeof parseDraftWithUnsplash> | null>(null);

  if (!isOpen) return null;

  // Real-time handle raw draft changes
  const handleDraftTextChange = (text: string) => {
    setRawDraftText(text);
    if (text.trim().length > 20) {
      const parsed = parseDraftWithUnsplash(text);
      if (importCoverUrl.trim()) {
        parsed.coverImage = normalizeUnsplashUrl(importCoverUrl.trim());
      }
      setParsedPreview(parsed);
    } else {
      setParsedPreview(null);
    }
  };

  // Convert parsed draft into form & publish
  const handleApplyDraft = () => {
    if (!rawDraftText.trim()) return;
    const parsed = parseDraftWithUnsplash(rawDraftText);
    const chosenCover = importCoverUrl.trim() ? normalizeUnsplashUrl(importCoverUrl) : (parsed.coverImage || coverImage);

    setTitle(parsed.title || 'Untitled Story');
    setSubtitle(parsed.subtitle || '');
    if (parsed.authorName) setAuthorName(parsed.authorName);
    if (parsed.authorRole) setAuthorRole(parsed.authorRole);
    if (parsed.region) setRegion(parsed.region);
    setCoverImage(chosenCover);

    // Build markdown text from parsed sections
    const textPieces = [parsed.intro || ''];
    parsed.sections.forEach(sec => {
      if (sec.heading) {
        textPieces.push(`### ${sec.heading}`);
      }
      if (sec.image?.url) {
        textPieces.push(`![${sec.image.caption || 'Photo'}](${sec.image.url})`);
      }
      textPieces.push(sec.paragraphs.join('\n\n'));
    });

    setFullArticleText(textPieces.filter(Boolean).join('\n\n'));
    setActiveTab('create');
    setEditorTab('edit');
    setSuccessMessage('Word taslağınız ve Unsplash fotoğrafları başarıyla editöre aktarıldı!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  // Apply Unsplash URL directly to Cover
  const handleApplyUnsplashUrl = () => {
    if (!unsplashInput.trim()) return;
    const normalized = normalizeUnsplashUrl(unsplashInput.trim());
    setCoverImage(normalized);
    setUnsplashInput('');
  };

  // Markdown Formatting Helper Functions
  const applyInlineFormat = (prefix: string, suffix: string, defaultPlaceholder: string = 'metin') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = fullArticleText.substring(start, end);
    const textToWrap = selectedText || defaultPlaceholder;

    const replacement = `${prefix}${textToWrap}${suffix}`;
    const newText = fullArticleText.substring(0, start) + replacement + fullArticleText.substring(end);
    setFullArticleText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + textToWrap.length);
    }, 20);
  };

  const applyLinePrefix = (prefix: string, defaultText: string = 'Bölüm Başlığı') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = fullArticleText.substring(start, end) || defaultText;

    const before = fullArticleText.substring(0, start);
    const after = fullArticleText.substring(end);

    const needsNewlineBefore = before.length > 0 && !before.endsWith('\n');
    const needsNewlineAfter = after.length > 0 && !after.startsWith('\n');

    const insertion = `${needsNewlineBefore ? '\n\n' : ''}${prefix}${selectedText}${needsNewlineAfter ? '\n\n' : ''}`;
    const newText = before + insertion + after;
    setFullArticleText(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + (needsNewlineBefore ? 2 : 0) + prefix.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 20);
  };

  const insertCustomTemplate = (template: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = fullArticleText.substring(0, start);
    const after = fullArticleText.substring(end);

    const needsNewline = before.length > 0 && !before.endsWith('\n');
    const insertion = `${needsNewline ? '\n\n' : ''}${template}\n`;
    const newText = before + insertion + after;
    setFullArticleText(newText);

    setTimeout(() => {
      textarea.focus();
      const pos = start + insertion.length;
      textarea.setSelectionRange(pos, pos);
    }, 20);
  };

  // Handle Edit Action from table
  const handleStartEdit = (art: Article) => {
    setEditingArticleId(art.id);
    setTitle(art.title);
    setSubtitle(art.subtitle || '');
    setCategory(art.category);
    setSubCategory(art.subCategory);
    setRegion(art.region || '');
    setAuthorName(art.author.name);
    setAuthorRole(art.author.role);
    setCoverImage(art.coverImage);
    setUnsplashInput('');
    
    // Reconstruct full text from intro and all sections
    const textPieces = [art.introParagraph || ''];
    if (art.sections && art.sections.length > 0) {
      art.sections.forEach((sec) => {
        if (sec.heading && !['Field Notes', 'Observations', 'Field Observations & Architecture'].includes(sec.heading)) {
          textPieces.push(`### ${sec.heading}`);
        }
        if (sec.image?.url) {
          textPieces.push(`![${sec.image.caption || 'Photo'}](${sec.image.url})`);
        }
        textPieces.push(sec.paragraphs.join('\n\n'));
      });
    }
    setFullArticleText(textPieces.filter(Boolean).join('\n\n'));
    setActiveTab('create');
  };

  // Reset form to blank creation mode
  const handleResetForm = () => {
    setEditingArticleId(null);
    setTitle('');
    setSubtitle('');
    setCategory('destinations');
    setSubCategory('Europe');
    setRegion('');
    setAuthorName('Özgür Yaman');
    setAuthorRole('Editor-in-Chief & Founder');
    setCoverImage('https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=1600&q=80');
    setUnsplashInput('');
    setFullArticleText('');
    setRawDraftText('');
    setParsedPreview(null);
  };

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
          setUnsplashInput('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert raw text to structured sections & image attachments
  const parseFullTextToSections = (rawText: string) => {
    const rawParagraphs = rawText
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (rawParagraphs.length === 0) {
      return { intro: '', sections: [] };
    }

    const intro = rawParagraphs[0];
    const remainingParagraphs = rawParagraphs.slice(1);

    if (remainingParagraphs.length === 0) {
      return { intro, sections: [] };
    }

    const sections: Article['sections'] = [];
    let currentHeading = 'Highlights & Observations';
    let currentParagraphs: string[] = [];
    let currentImage: Article['sections'][0]['image'] = undefined;

    remainingParagraphs.forEach((p) => {
      // Check for Markdown images: ![caption](url)
      const imgMatch = p.match(/^!\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/);
      if (imgMatch) {
        currentImage = {
          url: normalizeUnsplashUrl(imgMatch[2]),
          caption: imgMatch[1] || 'Editorial Photo',
          credit: 'Unsplash Archive'
        };
        return;
      }

      if (p.startsWith('#') || (p.length < 80 && (p.endsWith(':') || (p.toUpperCase() === p && p.length > 4 && !p.includes('.'))))) {
        if (currentParagraphs.length > 0) {
          sections.push({
            heading: currentHeading,
            paragraphs: currentParagraphs,
            image: currentImage,
          });
          currentParagraphs = [];
          currentImage = undefined;
        }
        currentHeading = p.replace(/^#+\s*/, '').replace(/:$/, '').trim();
      } else {
        currentParagraphs.push(p);
      }
    });

    if (currentParagraphs.length > 0) {
      sections.push({
        heading: currentHeading,
        paragraphs: currentParagraphs,
        image: currentImage,
      });
    }

    return { intro, sections };
  };

  const handlePublishOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fullArticleText.trim()) return;

    const { intro, sections } = parseFullTextToSections(fullArticleText);
    const totalWordCount = fullArticleText.split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(3, Math.ceil(totalWordCount / 180));

    const existingArticle = editingArticleId ? articles.find((a) => a.id === editingArticleId) : null;

    const slug =
      existingArticle?.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      `story-${Date.now()}`;

    const updatedArticle: Article = {
      id: editingArticleId || `custom-article-${Date.now()}`,
      slug: slug,
      title: title.trim(),
      subtitle: subtitle.trim() || intro.slice(0, 160) + '...',
      category: category,
      subCategory: subCategory,
      region: region.trim() || 'Global Route',
      coverImage: coverImage,
      author: {
        name: authorName.trim() || 'Özgür Yaman',
        role: authorRole.trim() || 'Editor-in-Chief & Founder',
      },
      publishedDate: existingArticle?.publishedDate || new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      readTime: `${readTimeMinutes} min read`,
      excerpt: (subtitle.trim() || intro).slice(0, 180) + '...',
      introParagraph: intro,
      sections: sections,
      tags: [subCategory, region.trim() || 'Curated', 'Editorial Essay', 'Vibe Routes'],
      featured: existingArticle ? existingArticle.featured : true,
      isEditorPick: true,
      affiliateDisclaimer: true,
    };

    if (editingArticleId) {
      onUpdateArticle(updatedArticle);
      setSuccessMessage('Yazınız başarıyla güncellendi ve yayına alındı!');
    } else {
      onAddArticle(updatedArticle);
      setSuccessMessage('Yazınız Unsplash fotoğraflarıyla birlikte başarıyla yayınlandı!');
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      handleResetForm();
      setActiveTab('manage');
    }, 1200);
  };

  // Copy entire articles array as TypeScript for GitHub
  const handleCopyTypeScriptCode = () => {
    const code = `import { Article } from '../types';\n\nexport const ARTICLES_DATA: Article[] = ${JSON.stringify(articles, null, 2)};\n`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1814]/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#E5E0D8] w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#2D2924]">
        
        {/* Light Modal Header */}
        <div className="p-5 sm:p-6 bg-[#FFFFFF] border-b border-[#E8E3DA] flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#D8D2C7] flex items-center justify-center">
              <PenTool className="w-5 h-5 text-[#9E7B54]" />
            </div>
            <div>
              <span className="text-[11px] font-ui uppercase tracking-[0.25em] text-[#8C827A] block font-semibold">
                VIBE ROUTES · EDITORIAL PUBLISHING DESK
              </span>
              <h3 className="font-display text-2xl font-light text-[#1A1814]">
                {editingArticleId ? 'Yazıyı Düzenle' : 'Yazı Yükleme & Editoryal Yönetim'}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Top Navigation Tabs */}
            <div className="flex bg-[#EFEAE2] p-1 border border-[#DCD5C9]">
              <button
                type="button"
                onClick={() => setActiveTab('importer')}
                className={`px-3 py-1.5 text-xs font-ui transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                  activeTab === 'importer'
                    ? 'bg-[#FFFFFF] text-[#1A1814] shadow-xs'
                    : 'text-[#767064] hover:text-[#1A1814]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#9E7B54]" />
                <span>Word & Unsplash Aktarıcı</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!editingArticleId) handleResetForm();
                  setActiveTab('create');
                }}
                className={`px-3 py-1.5 text-xs font-ui transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                  activeTab === 'create'
                    ? 'bg-[#FFFFFF] text-[#1A1814] shadow-xs'
                    : 'text-[#767064] hover:text-[#1A1814]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-[#9E7B54]" />
                <span>{editingArticleId ? 'Yazıyı Düzenle' : 'Manuel Editör'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className={`px-3 py-1.5 text-xs font-ui transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                  activeTab === 'manage'
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

        {/* Light Modal Body */}
        <div className="grow overflow-y-auto p-5 sm:p-7 space-y-6 bg-[#FAF8F5]">
          {showSuccess && (
            <div className="p-4 bg-[#F2F7F2] border border-[#B7DDB7] text-xs font-ui text-[#1E4620] flex items-center gap-2.5 rounded-xs">
              <Check className="w-5 h-5 text-[#2E7D32]" />
              <span className="font-semibold text-sm">{successMessage}</span>
            </div>
          )}

          {/* TAB 1: WORD / DRAFT & UNSPLASH AUTO IMPORTER */}
          {activeTab === 'importer' && (
            <div className="space-y-6">
              <div className="bg-[#FFFFFF] p-6 border border-[#E5E0D8] space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[#9E7B54] font-ui text-xs uppercase tracking-wider font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>Word, Google Docs veya Düz Metin Taslağı Yapıştırın</span>
                  </div>
                  <span className="text-[11px] font-ui text-[#8C827A]">
                    Unsplash linklerini otomatik tanır ve yüksek çözünürlüklü fotoğrafa çevirir.
                  </span>
                </div>

                <div className="bg-[#FAF8F5] p-3 border border-[#E8E3DA] text-xs font-ui text-[#5C564E] space-y-1">
                  <p className="font-medium text-[#1A1814]">💡 Freelance Yazarlar ve Editörler İçin Kolay İpuçları:</p>
                  <p>• Kapak için: Taslağın içine <code className="bg-[#FFFFFF] px-1 py-0.5 border border-[#DCD5C9]">[cover: https://unsplash.com/photos/...]</code> yazabilirsiniz.</p>
                  <p>• Yazar için: <code className="bg-[#FFFFFF] px-1 py-0.5 border border-[#DCD5C9]">Author: Ad Soyad</code> ve <code className="bg-[#FFFFFF] px-1 py-0.5 border border-[#DCD5C9]">Role: Contributing Writer</code> ekleyebilirsiniz.</p>
                  <p>• Bölüm fotoları için: Paragraf aralarına Unsplash linkini yapıştırmanız yeterlidir.</p>
                </div>

                {/* Optional Quick Cover Unsplash Input */}
                <div>
                  <label className="text-xs font-ui font-medium text-[#4A453E] block mb-1">
                    Özel Unsplash Kapak Linki (İsteğe bağlı):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://unsplash.com/photos/... veya https://images.unsplash.com/..."
                      value={importCoverUrl}
                      onChange={(e) => {
                        setImportCoverUrl(e.target.value);
                        if (parsedPreview) {
                          setParsedPreview({
                            ...parsedPreview,
                            coverImage: normalizeUnsplashUrl(e.target.value),
                          });
                        }
                      }}
                      className="grow bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Draft Text Area */}
                <div>
                  <label className="text-xs font-ui font-medium text-[#4A453E] block mb-1.5">
                    Metin Taslağını Buraya Yapıştırın:
                  </label>
                  <textarea
                    rows={12}
                    placeholder="Word'den kopyaladığınız yazıyı başlıkları ve Unsplash linkleriyle buraya doğrudan yapıştırın..."
                    value={rawDraftText}
                    onChange={(e) => handleDraftTextChange(e.target.value)}
                    className="w-full bg-[#FAFAF8] border border-[#D5CFC5] p-4 text-xs sm:text-sm font-reading text-[#1A1814] leading-[1.85] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                  />
                </div>

                {/* Parsed Live Preview Summary */}
                {parsedPreview && (
                  <div className="p-4 bg-[#FAF7F2] border border-[#D8D2C7] space-y-3">
                    <span className="text-xs font-ui uppercase tracking-wider text-[#9E7B54] font-semibold block">
                      ✓ Algılanan Yazı Özeti:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {parsedPreview.coverImage && (
                        <div className="md:col-span-3 h-24 bg-[#EBE5DC] overflow-hidden border border-[#D8D2C7]">
                          <img
                            src={parsedPreview.coverImage}
                            alt="Parsed Cover"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className={parsedPreview.coverImage ? 'md:col-span-9 space-y-1' : 'md:col-span-12 space-y-1'}>
                        <h4 className="font-display text-lg font-medium text-[#1A1814]">
                          {parsedPreview.title || 'Başlık algılanamadı (ilk satır başlık yapılabilir)'}
                        </h4>
                        <p className="text-xs font-ui text-[#767064]">
                          Yazar: <strong>{parsedPreview.authorName || authorName}</strong> · 
                          Bölüm Sayısı: <strong>{parsedPreview.sections.length}</strong> · 
                          Çıkarılan Unsplash Görseli: <strong>{parsedPreview.extractedUnsplashUrls.length}</strong>
                        </p>
                        {parsedPreview.intro && (
                          <p className="text-xs font-reading text-[#4A453E] line-clamp-2 italic">
                            "{parsedPreview.intro}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={!rawDraftText.trim()}
                    onClick={handleApplyDraft}
                    className="w-full py-3.5 bg-[#1A1814] hover:bg-[#9E7B54] disabled:opacity-50 text-[#FFFFFF] text-xs font-ui uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-[#C9A882]" />
                    <span>Taslağı İncele & Manuel Editöre Aktar</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL COMPOSER & EDITOR */}
          {activeTab === 'create' && (
            <form onSubmit={handlePublishOrUpdate} className="space-y-6">
              {editingArticleId && (
                <div className="p-3.5 bg-[#FFF9E6] border border-[#E6C665] flex items-center justify-between text-xs font-ui text-[#805B00]">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#B37D00]" />
                    <span>Şu an <strong>"{title || 'Seçili Yazı'}"</strong> başlıklı yazıyı düzenliyorsunuz.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="flex items-center gap-1 text-[#805B00] hover:text-[#1A1814] font-semibold underline cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Yeni Yazı Moduna Dön</span>
                  </button>
                </div>
              )}

              {/* 1. Article Title & Subtitle */}
              <div className="bg-[#FFFFFF] p-5 border border-[#E5E0D8] space-y-4 shadow-2xs">
                <div className="flex items-center space-x-2 text-[#9E7B54] font-ui text-xs uppercase tracking-wider font-semibold">
                  <BookOpen className="w-4 h-4" />
                  <span>1. Başlık ve Alt Başlık</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-ui font-medium text-[#4A453E] block mb-1.5">
                      Yazı Başlığı (Manşet) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Dublin: Where the Conversation Never Really Ends..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3.5 py-2.5 text-sm font-display text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-ui font-medium text-[#4A453E] block mb-1.5">
                      Alt Başlık / Kısa Giriş Cümlesi (İsteğe bağlı)
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: A guide to literary ghosts, amber-lit Victorian pubs, and Georgian squares."
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3.5 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Photo & Unsplash Link Manager */}
              <div className="bg-[#FFFFFF] p-5 border border-[#E5E0D8] space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[#9E7B54] font-ui text-xs uppercase tracking-wider font-semibold">
                    <ImageIcon className="w-4 h-4" />
                    <span>2. Kapak Görseli & Unsplash Linki</span>
                  </div>
                  <span className="text-[11px] font-ui text-[#8C827A]">
                    Unsplash sayfa linkini veya direkt görsel URL'sini yapıştırabilirsiniz.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  {/* Photo Preview */}
                  <div className="md:col-span-4 space-y-2">
                    <div className="w-full h-36 bg-[#EFEAE2] border border-[#D8D2C7] overflow-hidden relative">
                      <img
                        src={coverImage}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-ui text-[#8C827A] block text-center truncate">
                      {coverImage.slice(0, 45)}...
                    </span>
                  </div>

                  {/* Photo Actions */}
                  <div className="md:col-span-8 space-y-3">
                    {/* Unsplash Link input */}
                    <div>
                      <label className="text-[11px] font-ui font-medium text-[#4A453E] block mb-1">
                        Unsplash Fotoğraf Linki:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://unsplash.com/photos/... veya https://images.unsplash.com/..."
                          value={unsplashInput}
                          onChange={(e) => setUnsplashInput(e.target.value)}
                          className="grow bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleApplyUnsplashUrl}
                          className="px-4 py-2 bg-[#1A1814] hover:bg-[#9E7B54] text-[#FFFFFF] text-xs font-ui cursor-pointer transition-colors"
                        >
                          Uygula
                        </button>
                      </div>
                    </div>

                    {/* Upload or Select Preset */}
                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="py-1.5 px-3 bg-[#F2EDE4] hover:bg-[#E5DFD4] border border-[#D5CFC5] text-[#1A1814] text-[11px] font-ui flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#9E7B54]" />
                        <span>Dosya Yükle</span>
                      </button>

                      <span className="text-[11px] font-ui text-[#8C827A]">veya hazır kütüphaneden seçin:</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
                      {PRESET_PHOTOS.map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCoverImage(preset.url)}
                          className={`h-12 border overflow-hidden transition-all cursor-pointer relative group ${
                            coverImage === preset.url
                              ? 'border-[#9E7B54] ring-2 ring-[#9E7B54]/40'
                              : 'border-[#D5CFC5] opacity-75 hover:opacity-100'
                          }`}
                          title={preset.label}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Text Editor & Markdown Toolbar */}
              <div className="bg-[#FFFFFF] p-5 border border-[#E5E0D8] space-y-3.5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-[#9E7B54] font-ui text-xs uppercase tracking-wider font-semibold">
                    <PenTool className="w-4 h-4" />
                    <span>3. Yazı Metni & Paragraflar *</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 bg-[#F4EFEA] p-1 border border-[#D8D2C7]">
                    <button
                      type="button"
                      onClick={() => setEditorTab('edit')}
                      className={`px-3 py-1 text-xs font-ui cursor-pointer transition-colors flex items-center space-x-1.5 ${
                        editorTab === 'edit'
                          ? 'bg-[#1A1814] text-[#FAFAF7] font-medium shadow-2xs'
                          : 'text-[#5C564E] hover:text-[#1A1814]'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Metin Editörü</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab('preview')}
                      className={`px-3 py-1 text-xs font-ui cursor-pointer transition-colors flex items-center space-x-1.5 ${
                        editorTab === 'preview'
                          ? 'bg-[#1A1814] text-[#FAFAF7] font-medium shadow-2xs'
                          : 'text-[#5C564E] hover:text-[#1A1814]'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Canlı Önizleme</span>
                    </button>
                  </div>
                </div>

                {editorTab === 'edit' ? (
                  <div className="space-y-2.5">
                    {/* Rich Formatting Toolbar */}
                    <div className="bg-[#FAF7F2] border border-[#D8D2C7] p-2 flex flex-wrap items-center gap-1.5">
                      <div className="flex items-center space-x-1 pr-2 border-r border-[#D8D2C7]">
                        <button
                          type="button"
                          onClick={() => applyInlineFormat('**', '**', 'kalın metin')}
                          title="Kalın / Bold (**metin**)"
                          className="p-1.5 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] transition-colors cursor-pointer"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyInlineFormat('*', '*', 'italik metin')}
                          title="İtalik / Italic (*metin*)"
                          className="p-1.5 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] transition-colors cursor-pointer"
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-1 pr-2 border-r border-[#D8D2C7]">
                        <button
                          type="button"
                          onClick={() => applyLinePrefix('## ', 'Büyük Başlık')}
                          title="Bölüm Başlığı (H2)"
                          className="px-2 py-1 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] text-xs font-display font-semibold transition-colors cursor-pointer"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => applyLinePrefix('### ', 'Alt Başlık')}
                          title="Bölüm Başlığı (H3)"
                          className="px-2 py-1 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] text-xs font-display transition-colors cursor-pointer"
                        >
                          H3
                        </button>
                      </div>

                      <div className="flex items-center space-x-1 pr-2 border-r border-[#D8D2C7]">
                        <button
                          type="button"
                          onClick={() => applyLinePrefix('- ', 'Madde içeriği')}
                          className="p-1.5 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] transition-colors cursor-pointer"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyLinePrefix('1. ', 'Numaralı madde')}
                          className="p-1.5 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] transition-colors cursor-pointer"
                        >
                          <ListOrdered className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyLinePrefix('> ', 'Alıntı metni')}
                          className="p-1.5 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] transition-colors cursor-pointer"
                        >
                          <Quote className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-1 pr-2 border-r border-[#D8D2C7]">
                        <button
                          type="button"
                          onClick={() => applyInlineFormat('[', '](https://example.com)', 'Bağlantı Metni')}
                          className="p-1.5 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] transition-colors cursor-pointer flex items-center space-x-1 text-xs"
                        >
                          <Link className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertCustomTemplate('\n---\n')}
                          className="p-1.5 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] transition-colors cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Add Image inside Article button */}
                      <button
                        type="button"
                        onClick={() => insertCustomTemplate('![Fotoğraf Açıklaması](https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=1600&q=80)')}
                        className="px-2.5 py-1 text-[11px] font-ui bg-[#FFFFFF] hover:bg-[#9E7B54] hover:text-[#FFFFFF] text-[#4A453E] border border-[#D5CFC5] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>+ Unsplash Fotoğrafı Ekle</span>
                      </button>
                    </div>

                    <textarea
                      ref={textareaRef}
                      required
                      rows={14}
                      placeholder="Yazınızın tüm paragraflarını buraya yapıştırın veya yazın... 

Örnek biçimlendirmeler:
### Temple Bar and Trinity College
Most people find their way to Temple Bar within hours of arriving...

> 'The Long Room library is one of those rooms that makes you feel slightly better about being human.'

* **The Temple Bar Pub** — Traditional music sessions daily.
* **Davy Byrne’s** — Joyce’s favorite for gorgonzola sandwiches."
                      value={fullArticleText}
                      onChange={(e) => setFullArticleText(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] p-4 text-xs sm:text-sm font-reading text-[#1A1814] leading-[1.9] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                    />

                    <div className="flex items-center justify-between text-[11px] font-ui text-[#8C827A] pt-1">
                      <span>Metin içinde `**kalın**`, `*italik*`, `### Başlık`, alıntılar ve linkler kullanabilirsiniz.</span>
                      <span>{fullArticleText.split(/\s+/).filter(Boolean).length} kelime</span>
                    </div>
                  </div>
                ) : (
                  /* Live Preview Tab */
                  <div className="bg-[#FAF8F5] border border-[#D8D2C7] p-6 max-h-[420px] overflow-y-auto space-y-4">
                    {fullArticleText.trim().length === 0 ? (
                      <div className="text-center py-12 text-[#8C827A] font-ui text-xs">
                        Önizlenecek metin bulunamadı. Lütfen "Metin Editörü" sekmesine geçip metin yazın.
                      </div>
                    ) : (
                      <div className="prose-editorial max-w-none text-[#2D2924] space-y-4 text-sm sm:text-base font-reading leading-[1.95]">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-4 leading-[1.95]">{children}</p>,
                            strong: ({ children }) => <strong className="font-semibold text-[#1A1814]">{children}</strong>,
                            em: ({ children }) => <em className="italic text-[#2D2924]">{children}</em>,
                            h2: ({ children }) => (
                              <h2 className="font-display text-2xl font-light text-[#1A1814] tracking-tight mt-6 mb-3 border-b border-[#E5E0D8] pb-2">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="font-display text-lg font-medium text-[#1A1814] mt-5 mb-2">
                                {children}
                              </h3>
                            ),
                            ul: ({ children }) => <ul className="list-disc list-outside pl-5 my-3 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-outside pl-5 my-3 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="leading-[1.8]">{children}</li>,
                            blockquote: ({ children }) => (
                              <blockquote className="my-4 border-l-2 border-[#9E7B54] pl-4 py-1 bg-[#FAF7F2] text-[#4A453E] italic">
                                {children}
                              </blockquote>
                            ),
                            img: ({ src, alt }) => (
                              <div className="my-4 overflow-hidden border border-[#E5E0D8]">
                                <img src={src} alt={alt || ''} className="w-full h-64 object-cover" />
                                {alt && <span className="block p-2 text-xs font-ui text-[#767064] bg-[#FFFFFF]">{alt}</span>}
                              </div>
                            ),
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#9E7B54] font-medium underline underline-offset-4 decoration-[#9E7B54]/40 hover:text-[#1A1814] transition-colors"
                              >
                                {children}
                              </a>
                            ),
                            hr: () => <hr className="my-6 border-[#E5E0D8]" />,
                          }}
                        >
                          {fullArticleText}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 4. Category & Author Profile (Freelance / Editor support) */}
              <div className="bg-[#FFFFFF] p-5 border border-[#E5E0D8] space-y-4 shadow-2xs">
                <div className="flex items-center space-x-2 text-[#9E7B54] font-ui text-xs uppercase tracking-wider font-semibold">
                  <User className="w-4 h-4" />
                  <span>4. Yazar Profili & Kategori Detayları</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Category */}
                  <div>
                    <label className="text-xs font-ui font-medium text-[#4A453E] block mb-1.5">
                      Ana Kategori *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as MainCategory)}
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SubCategory */}
                  <div>
                    <label className="text-xs font-ui font-medium text-[#4A453E] block mb-1.5">
                      Alt Kategori / Konu *
                    </label>
                    <select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value as SubCategory)}
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                    >
                      {SUBCATEGORY_OPTIONS.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Region / Location */}
                  <div>
                    <label className="text-xs font-ui font-medium text-[#4A453E] block mb-1.5">
                      Bölge / Şehir / Ülke
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#8C827A]">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        placeholder="Örn: Dublin, Ireland veya Kyoto, Japan"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full bg-[#FAFAF8] border border-[#D5CFC5] pl-8 pr-3 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EFEAE2]">
                  {/* Author Name */}
                  <div>
                    <label className="text-xs font-ui font-medium text-[#4A453E] block mb-1">
                      Yazar Adı Soyadı
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Örn: Özgür Yaman veya Selin Aras"
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-1.5 text-xs font-ui text-[#1A1814]"
                    />
                  </div>

                  {/* Author Role */}
                  <div>
                    <label className="text-xs font-ui font-medium text-[#4A453E] block mb-1">
                      Yazar Unvanı / Görevi
                    </label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder="Örn: Editor-in-Chief veya Contributing Travel Writer"
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-1.5 text-xs font-ui text-[#1A1814]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit / Update Button */}
              <div className="pt-2 flex gap-3">
                {editingArticleId && (
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="py-4 px-6 bg-[#EFEAE2] hover:bg-[#E2DCCE] text-[#1A1814] text-xs font-ui uppercase tracking-wider font-semibold cursor-pointer transition-colors"
                  >
                    Vazgeç
                  </button>
                )}
                <button
                  type="submit"
                  className="grow py-4 bg-[#1A1814] hover:bg-[#9E7B54] text-[#FFFFFF] text-sm font-ui uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
                >
                  <PenTool className="w-4 h-4" />
                  <span>{editingArticleId ? 'Değişiklikleri Kaydet & Güncelle' : 'Yazıyı Tam Metin & Unsplash Görselleriyle Yayına Al'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: MANAGE STORIES & GITHUB SYNC */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-[#E5E0D8]">
                <div>
                  <span className="text-xs font-ui text-[#767064]">
                    Yayındaki Toplam Yazı Sayısı: <strong className="text-[#1A1814]">{articles.length}</strong>
                  </span>
                  <span className="text-[11px] font-ui text-[#8C827A] block">
                    Tüm yazıları düzenleyebilir, önizleyebilir veya tek tıkla GitHub için dışa aktarabilirsiniz.
                  </span>
                </div>

                <button
                  onClick={handleCopyTypeScriptCode}
                  className="px-3.5 py-2 bg-[#FAF8F5] hover:bg-[#1A1814] text-[#1A1814] hover:text-[#FFFFFF] border border-[#D8D2C7] text-xs font-ui flex items-center gap-1.5 transition-colors cursor-pointer font-medium shrink-0"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span className="text-[#2E7D32] font-semibold">Kod Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Code className="w-3.5 h-3.5 text-[#9E7B54]" />
                      <span>GitHub İçin TypeScript Kodu Kopyala</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 bg-[#FFFFFF] border border-[#E5E0D8] flex items-center justify-between gap-4 transition-all shadow-2xs hover:border-[#D5CFC5]"
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="w-16 h-12 bg-[#EBE5DC] overflow-hidden shrink-0 border border-[#E5E0D8]">
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-ui uppercase tracking-wider text-[#9E7B54] font-semibold block">
                          {art.category.toUpperCase()} · {art.subCategory} · {art.region}
                        </span>
                        <h4 className="font-display text-lg font-normal text-[#1A1814] truncate">
                          {art.title}
                        </h4>
                        <span className="text-[11px] font-ui text-[#767064]">
                          {art.author.name} ({art.author.role}) · {art.publishedDate} · {art.readTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleStartEdit(art)}
                        className="px-3 py-1.5 bg-[#FAF8F5] text-[#1A1814] hover:bg-[#9E7B54] hover:text-[#FFFFFF] border border-[#D8D2C7] text-xs font-ui flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
                        title="Yazıyı Düzenle"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Düzenle</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectArticle(art);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-[#FAF8F5] text-[#1A1814] hover:bg-[#1A1814] hover:text-[#FFFFFF] border border-[#D8D2C7] text-xs font-ui flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Canlı Görüntüle"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Oku</span>
                      </button>

                      {art.id.startsWith('custom-article-') && (
                        <button
                          onClick={() => onDeleteArticle(art.id)}
                          className="p-2 text-[#767064] hover:text-[#C53030] hover:bg-[#FFF5F5] border border-transparent hover:border-[#FEB2B2] cursor-pointer"
                          title="Yazıyı Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Light Modal Footer */}
        <div className="p-4 bg-[#FFFFFF] border-t border-[#E8E3DA] flex items-center justify-between text-xs font-ui text-[#767064]">
          <span>Vibe Routes Editorial Desk & Submissions Portal</span>
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-wider text-[#1A1814] hover:text-[#9E7B54] font-semibold cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

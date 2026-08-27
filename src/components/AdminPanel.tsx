import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Article, MainCategory, SubCategory } from '../types';
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
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link,
  Minus,
  Sparkles,
  HelpCircle,
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
    label: 'Nordic Minimalist',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Alpine Retreat',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Parisian Grandeur',
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
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [editorTab, setEditorTab] = useState<'edit' | 'preview'>('edit');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<MainCategory>('experiences');
  const [subCategory, setSubCategory] = useState<SubCategory>('Hidden Gems');
  const [region, setRegion] = useState('');
  const [authorName, setAuthorName] = useState('Özgür Yaman');
  const [authorRole, setAuthorRole] = useState('Founder & Travel Essayist');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80'
  );
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [fullArticleText, setFullArticleText] = useState('');
  const [ambientSound, setAmbientSound] = useState<'rain' | 'ocean' | 'train' | 'cafe' | 'temple'>('rain');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  const applyLinePrefix = (prefix: string, defaultText: string = 'Metin') => {
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

  if (!isOpen) return null;

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
    setCustomImageUrl('');
    
    // Reconstruct full text from intro and all sections
    const textPieces = [art.introParagraph || ''];
    if (art.sections && art.sections.length > 0) {
      art.sections.forEach((sec) => {
        if (sec.heading && !['Field Notes', 'Observations', 'Field Observations & Architecture'].includes(sec.heading)) {
          textPieces.push(`### ${sec.heading}`);
        }
        textPieces.push(sec.paragraphs.join('\n\n'));
      });
    }
    setFullArticleText(textPieces.filter(Boolean).join('\n\n'));
    setAmbientSound(art.ambientSoundtrack?.type || 'rain');
    setActiveTab('create');
  };

  // Reset form to blank creation mode
  const handleResetForm = () => {
    setEditingArticleId(null);
    setTitle('');
    setSubtitle('');
    setCategory('experiences');
    setSubCategory('Hidden Gems');
    setRegion('');
    setAuthorName('Özgür Yaman');
    setAuthorRole('Founder & Travel Essayist');
    setCoverImage('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80');
    setCustomImageUrl('');
    setFullArticleText('');
  };

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
          setCustomImageUrl('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert raw pasted text into complete, untruncated editorial sections
  const parseFullTextToSections = (rawText: string) => {
    // Split on double line breaks OR single line breaks so pasted paragraphs aren't squished
    const rawParagraphs = rawText
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (rawParagraphs.length === 0) {
      return {
        intro: '',
        sections: [],
      };
    }

    const intro = rawParagraphs[0];
    const remainingParagraphs = rawParagraphs.slice(1);

    if (remainingParagraphs.length === 0) {
      return {
        intro,
        sections: [],
      };
    }

    const sections: { heading: string; paragraphs: string[] }[] = [];
    let currentHeading = '';
    let currentParagraphs: string[] = [];

    remainingParagraphs.forEach((p) => {
      // If user typed an explicit heading line (e.g. starts with # or short title)
      if (p.startsWith('#') || (p.length < 75 && (p.endsWith(':') || (p.toUpperCase() === p && p.length > 4 && !p.includes('.'))))) {
        if (currentParagraphs.length > 0) {
          sections.push({
            heading: currentHeading,
            paragraphs: currentParagraphs,
          });
          currentParagraphs = [];
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
        role: authorRole.trim() || 'Founder & Travel Essayist',
      },
      publishedDate: existingArticle?.publishedDate || new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      readTime: `${readTimeMinutes} min read`,
      excerpt: (subtitle.trim() || intro).slice(0, 180) + '...',
      introParagraph: intro,
      sections: sections,
      tags: [subCategory, region.trim() || 'Curated', 'Editorial Essay'],
      featured: existingArticle ? existingArticle.featured : true,
      isEditorPick: true,
      affiliateDisclaimer: true,
      ambientSoundtrack: {
        title: `${ambientSound.charAt(0).toUpperCase() + ambientSound.slice(1)} Ambience`,
        type: ambientSound,
      },
    };

    if (editingArticleId) {
      onUpdateArticle(updatedArticle);
      setSuccessMessage('Yazınız başarıyla güncellendi ve yayına alındı!');
    } else {
      onAddArticle(updatedArticle);
      setSuccessMessage('Yazınız hiçbir paragrafı kırpılmadan tam metin olarak başarıyla yayınlandı!');
    }

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      handleResetForm();
      setActiveTab('manage');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1814]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#E5E0D8] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#2D2924]">
        
        {/* Light Modal Header */}
        <div className="p-5 sm:p-6 bg-[#FFFFFF] border-b border-[#E8E3DA] flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#D8D2C7] flex items-center justify-center">
              <PenTool className="w-5 h-5 text-[#9E7B54]" />
            </div>
            <div>
              <span className="text-[11px] font-ui uppercase tracking-[0.25em] text-[#8C827A] block font-semibold">
                VIBE ROUTES · EDITORIAL DESK
              </span>
              <h3 className="font-display text-2xl font-light text-[#1A1814]">
                {editingArticleId ? 'Yazıyı Düzenle' : 'Yeni Yazı & Hikâye Yayınla'}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-[#EFEAE2] p-1 border border-[#DCD5C9]">
              <button
                type="button"
                onClick={() => {
                  if (!editingArticleId) handleResetForm();
                  setActiveTab('create');
                }}
                className={`px-3.5 py-1.5 text-xs font-ui transition-all cursor-pointer font-medium ${
                  activeTab === 'create'
                    ? 'bg-[#FFFFFF] text-[#1A1814] shadow-xs'
                    : 'text-[#767064] hover:text-[#1A1814]'
                }`}
              >
                {editingArticleId ? '✏️ Yazıyı Düzenle' : '+ Yeni Yazı Ekle'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className={`px-3.5 py-1.5 text-xs font-ui transition-all cursor-pointer font-medium ${
                  activeTab === 'manage'
                    ? 'bg-[#FFFFFF] text-[#1A1814] shadow-xs'
                    : 'text-[#767064] hover:text-[#1A1814]'
                }`}
              >
                Yayındaki Yazılar ({articles.length})
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

          {activeTab === 'create' ? (
            <form onSubmit={handlePublishOrUpdate} className="space-y-6">
              
              {/* Editing Notification Banner */}
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
                      placeholder="Örn: The Quiet Art of Slow Travel in the Dolomites..."
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
                      placeholder="Örn: A meditative journey through timber architecture, high-altitude trails, and alpine silence."
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3.5 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Full Article Textarea with Rich Editorial Toolbar & Live Preview */}
              <div className="bg-[#FFFFFF] p-5 border border-[#E5E0D8] space-y-3.5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-[#9E7B54] font-ui text-xs uppercase tracking-wider font-semibold">
                    <PenTool className="w-4 h-4" />
                    <span>2. Yazı Metni & Biçimlendirme Araç Çubuğu (Toolbar) *</span>
                  </div>
                  
                  {/* Editor / Preview Tabs */}
                  <div className="flex items-center space-x-1 bg-[#F4EFEA] p-1 border border-[#D8D2C7] rounded-none">
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
                          className="p-1.5 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] hover:border-[#1A1814] transition-colors cursor-pointer"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyInlineFormat('*', '*', 'italik metin')}
                          title="İtalik / Italic (*metin*)"
                          className="p-1.5 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] hover:border-[#1A1814] transition-colors cursor-pointer"
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-1 pr-2 border-r border-[#D8D2C7]">
                        <button
                          type="button"
                          onClick={() => applyLinePrefix('## ', 'Büyük Başlık')}
                          title="Büyük Bölüm Başlığı (H2)"
                          className="px-2 py-1 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] hover:border-[#1A1814] text-xs font-display font-semibold transition-colors cursor-pointer"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => applyLinePrefix('### ', 'Alt Başlık')}
                          title="Alt Başlık (H3)"
                          className="px-2 py-1 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] hover:border-[#1A1814] text-xs font-display transition-colors cursor-pointer"
                        >
                          H3
                        </button>
                      </div>

                      <div className="flex items-center space-x-1 pr-2 border-r border-[#D8D2C7]">
                        <button
                          type="button"
                          onClick={() => applyLinePrefix('- ', 'Madde içeriği')}
                          title="Madde İşaretli Liste"
                          className="p-1.5 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] hover:border-[#1A1814] transition-colors cursor-pointer"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyLinePrefix('1. ', 'Numaralı madde')}
                          title="Numaralı Liste"
                          className="p-1.5 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] hover:border-[#1A1814] transition-colors cursor-pointer"
                        >
                          <ListOrdered className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => applyLinePrefix('> ', 'Alıntı metni')}
                          title="Alıntı / Blockquote"
                          className="p-1.5 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] hover:border-[#1A1814] transition-colors cursor-pointer"
                        >
                          <Quote className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-1 pr-2 border-r border-[#D8D2C7]">
                        <button
                          type="button"
                          onClick={() => applyInlineFormat('[', '](https://example.com)', 'Bağlantı Metni')}
                          title="Link / Bağlantı Ekle"
                          className="p-1.5 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] hover:border-[#1A1814] transition-colors cursor-pointer flex items-center space-x-1 text-xs"
                        >
                          <Link className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertCustomTemplate('\n---\n')}
                          title="Ayraç Çizgisi (Divider)"
                          className="p-1.5 bg-[#FFFFFF] hover:bg-[#EFEAE2] text-[#1A1814] border border-[#D5CFC5] hover:border-[#1A1814] transition-colors cursor-pointer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quick Info Field Shortcuts */}
                      <div className="flex flex-wrap items-center gap-1 pl-1">
                        <button
                          type="button"
                          onClick={() => insertCustomTemplate('**Departure:** Ueno, Tokyo. Two to four-night seasonal itineraries.')}
                          className="px-2 py-1 text-[11px] font-ui bg-[#FFFFFF] hover:bg-[#9E7B54] hover:text-[#FFFFFF] text-[#4A453E] border border-[#D5CFC5] transition-colors cursor-pointer"
                        >
                          + Departure
                        </button>
                        <button
                          type="button"
                          onClick={() => insertCustomTemplate('**Booking:** Lottery system via official website.')}
                          className="px-2 py-1 text-[11px] font-ui bg-[#FFFFFF] hover:bg-[#9E7B54] hover:text-[#FFFFFF] text-[#4A453E] border border-[#D5CFC5] transition-colors cursor-pointer"
                        >
                          + Booking
                        </button>
                        <button
                          type="button"
                          onClick={() => insertCustomTemplate('**Price:** From JPY 320,000 / person (standard suite).')}
                          className="px-2 py-1 text-[11px] font-ui bg-[#FFFFFF] hover:bg-[#9E7B54] hover:text-[#FFFFFF] text-[#4A453E] border border-[#D5CFC5] transition-colors cursor-pointer"
                        >
                          + Price
                        </button>
                        <button
                          type="button"
                          onClick={() => insertCustomTemplate('**Best season:** Autumn foliage (October–November).')}
                          className="px-2 py-1 text-[11px] font-ui bg-[#FFFFFF] hover:bg-[#9E7B54] hover:text-[#FFFFFF] text-[#4A453E] border border-[#D5CFC5] transition-colors cursor-pointer"
                        >
                          + Best season
                        </button>
                        <button
                          type="button"
                          onClick={() => insertCustomTemplate('**Book:** [Official Booking & Tour Operator](https://example.com)')}
                          className="px-2 py-1 text-[11px] font-ui bg-[#FFFFFF] hover:bg-[#9E7B54] hover:text-[#FFFFFF] text-[#4A453E] border border-[#D5CFC5] transition-colors cursor-pointer font-medium"
                        >
                          + Book Link
                        </button>
                      </div>
                    </div>

                    <textarea
                      ref={textareaRef}
                      required
                      rows={14}
                      placeholder="Yazınızın tüm paragraflarını buraya yapıştırın veya yazın... 

Örnek biçimlendirmeler:
**Departure:** Ueno, Tokyo.
**Price:** From JPY 320,000 / person
**Book:** [Rezervasyon Linki](https://booking.com)

İstediğiniz kelimeyi seçip üstteki B (Kalın) veya I (İtalik) butonuna basabilirsiniz."
                      value={fullArticleText}
                      onChange={(e) => setFullArticleText(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] p-4 text-xs sm:text-sm font-reading text-[#1A1814] leading-[1.9] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                    />

                    <div className="flex items-center justify-between text-[11px] font-ui text-[#8C827A] pt-1">
                      <span>Metin içinde `**kalın**`, `*italik*`, `## Başlık` ve linkler kullanabilirsiniz.</span>
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

              {/* 3. Photo & Cover Selection */}
              <div className="bg-[#FFFFFF] p-5 border border-[#E5E0D8] space-y-4 shadow-2xs">
                <div className="flex items-center space-x-2 text-[#9E7B54] font-ui text-xs uppercase tracking-wider font-semibold">
                  <ImageIcon className="w-4 h-4" />
                  <span>3. Kapak Fotoğrafı Ekle / Değiştir</span>
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
                    <span className="text-[10px] font-ui text-[#8C827A] block text-center">
                      Mevcut Seçili Kapak Fotoğrafı
                    </span>
                  </div>

                  {/* Photo Actions */}
                  <div className="md:col-span-8 space-y-3">
                    {/* Upload button */}
                    <div>
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
                        className="w-full py-2.5 px-4 bg-[#F2EDE4] hover:bg-[#E5DFD4] border border-[#D5CFC5] text-[#1A1814] text-xs font-ui font-medium flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4 text-[#9E7B54]" />
                        <span>Bilgisayardan Fotoğraf Yükle</span>
                      </button>
                    </div>

                    {/* Image URL option */}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Veya görsel linki yapıştırın (https://...)"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        className="grow bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customImageUrl.trim()) {
                            setCoverImage(customImageUrl.trim());
                          }
                        }}
                        className="px-3 py-2 bg-[#1A1814] text-[#FFFFFF] text-xs font-ui cursor-pointer"
                      >
                        Uygula
                      </button>
                    </div>

                    {/* Curated Presets */}
                    <div>
                      <span className="text-[11px] font-ui font-medium text-[#706A62] block mb-1.5">
                        Ya da hazır yüksek çözünürlüklü fotoğraflardan seçin:
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                        {PRESET_PHOTOS.map((preset, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setCoverImage(preset.url);
                              setCustomImageUrl('');
                            }}
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
              </div>

              {/* 4. Category & Location Details */}
              <div className="bg-[#FFFFFF] p-5 border border-[#E5E0D8] space-y-4 shadow-2xs">
                <div className="flex items-center space-x-2 text-[#9E7B54] font-ui text-xs uppercase tracking-wider font-semibold">
                  <Layers className="w-4 h-4" />
                  <span>4. Kategori ve Bölge Bilgileri</span>
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
                        placeholder="Örn: Dolomitler, İtalya veya Kyoto, Japonya"
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
                      Yazar Adı
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-1.5 text-xs font-ui text-[#1A1814]"
                    />
                  </div>

                  {/* Ambient Audio */}
                  <div>
                    <label className="text-xs font-ui font-medium text-[#4A453E] block mb-1">
                      Okuma Arka Plan Ambiyansı
                    </label>
                    <select
                      value={ambientSound}
                      onChange={(e) => setAmbientSound(e.target.value as any)}
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-1.5 text-xs font-ui text-[#1A1814]"
                    >
                      <option value="rain">Hafif Yağmur Sesi (Rainfall)</option>
                      <option value="waves">Okyanus Dalgaları (Ocean Waves)</option>
                      <option value="fireplace">Şömine Çıtırtısı (Fireplace)</option>
                      <option value="cafe">Paris Cafe Ambiyansı (Cafe)</option>
                    </select>
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
                  <span>{editingArticleId ? 'Değişiklikleri Kaydet & Güncelle' : 'Yazıyı Tam Metin Olarak Yayına Al'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Manage Stories Table */
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#E5E0D8]">
                <span className="text-xs font-ui text-[#767064]">
                  Yayındaki Toplam Yazı Sayısı: <strong className="text-[#1A1814]">{articles.length}</strong>
                </span>
                <span className="text-[11px] font-ui text-[#8C827A]">
                  Tüm yazıları düzenleyebilir, silebilir veya canlı görüntüleyebilirsiniz.
                </span>
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
                          {art.author.name} · {art.publishedDate} · {art.readTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEdit(art)}
                        className="px-3 py-1.5 bg-[#FAF8F5] text-[#1A1814] hover:bg-[#9E7B54] hover:text-[#FFFFFF] border border-[#D8D2C7] text-xs font-ui flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
                        title="Yazıyı Düzenle"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Düzenle</span>
                      </button>

                      {/* View Button */}
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

                      {/* Delete Button */}
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
          <span>Vibe Routes Publication Desk</span>
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

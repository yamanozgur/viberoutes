import React, { useState, useRef } from 'react';
import { Article, MainCategory, SubCategory } from '../types';
import { parseDocxFile, ParsedDocxResult } from '../utils/docxImporter';
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
  AlertCircle,
  Edit3,
  RotateCcw,
  Plus,
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onAddArticle: (article: Article) => void;
  onUpdateArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onSelectArticle: (article: Article) => void;
  initialTab?: 'upload' | 'editor' | 'articles' | 'history';
}

interface ActionLog {
  id: string;
  time: string;
  type: 'upload' | 'edit' | 'publish' | 'delete' | 'photo';
  message: string;
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
  onUpdateArticle,
  onDeleteArticle,
  onSelectArticle,
  initialTab = 'upload',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'editor' | 'articles' | 'history'>(initialTab);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  
  // Action History Logs with LocalStorage persistence
  const [historyFilter, setHistoryFilter] = useState<'all' | 'upload' | 'edit' | 'publish' | 'delete' | 'photo'>('all');
  const [actionHistory, setActionHistory] = useState<ActionLog[]>(() => {
    try {
      const saved = localStorage.getItem('viberoutes_action_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'log-init-1',
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type: 'publish',
        message: 'Editoryal sistem aktif. Bilgisayardan Word (.docx) ve fotoğraf yükleme modülü hazır.'
      },
      {
        id: 'log-init-2',
        time: '05:30:12',
        type: 'photo',
        message: 'Fotoğraf optimizasyon motoru ve kırpma hazır.'
      }
    ];
  });

  const addLog = (type: ActionLog['type'], message: string) => {
    const newLog: ActionLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type,
      message,
    };
    setActionHistory((prev) => {
      const updated = [newLog, ...prev].slice(0, 100);
      try {
        localStorage.setItem('viberoutes_action_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save action history:', e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    const resetLogs: ActionLog[] = [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type: 'publish',
        message: 'İşlem geçmişi sıfırlandı. Yeni işlemler burada anlık görüntülenecek.'
      }
    ];
    setActionHistory(resetLogs);
    try {
      localStorage.setItem('viberoutes_action_history', JSON.stringify(resetLogs));
    } catch {
      // ignore
    }
  };
  
  // Editing state
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  
  // Editable fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [introParagraph, setIntroParagraph] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [category, setCategory] = useState<MainCategory>('destinations');
  const [subCategory, setSubCategory] = useState<SubCategory>('Europe');
  const [region, setRegion] = useState('Europe');
  const [authorName, setAuthorName] = useState('Özgür Yaman');
  const [authorRole, setAuthorRole] = useState('Editor-in-Chief & Founder');
  const [coverUrl, setCoverUrl] = useState(DEFAULT_COVER);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Convert uploaded image file to Data URL
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Lütfen geçerli bir görsel dosyası (JPG, PNG, WebP) seçin.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverUrl(reader.result);
          setSuccessMessage('Kapak fotoğrafı bilgisayarınızdan başarıyla yüklendi!');
          addLog('photo', `Fotoğraf yüklendi: "${file.name}" (${(file.size / 1024).toFixed(0)} KB)`);
          setTimeout(() => setSuccessMessage(''), 2500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Process Word docx file
  const handleProcessFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.docx') && !file.name.toLowerCase().endsWith('.doc')) {
      setErrorMessage('Lütfen geçerli bir Microsoft Word (.docx) dosyası yükleyin.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const parsed: ParsedDocxResult = await parseDocxFile(file);
      setEditingArticleId(null);
      setFileName(file.name);
      
      setTitle(parsed.title);
      setSubtitle(parsed.subtitle);
      setIntroParagraph(parsed.intro);

      // Construct plain text / paragraphs for sections
      const sectionsText = parsed.sections
        .map((s) => `### ${s.heading}\n\n${s.paragraphs.join('\n\n')}`)
        .join('\n\n');
      setBodyText(sectionsText);

      if (parsed.detectedAuthor) setAuthorName(parsed.detectedAuthor);
      if (parsed.detectedRegion) setRegion(parsed.detectedRegion);
      if (parsed.extractedCoverUrl && parsed.extractedCoverUrl.startsWith('http')) {
        setCoverUrl(parsed.extractedCoverUrl);
      } else {
        setCoverUrl(DEFAULT_COVER);
      }

      addLog('upload', `Word dosyası okundu: "${file.name}" (${parsed.wordCount} kelime)`);
      setActiveTab('editor');
      setSuccessMessage(`"${file.name}" başarıyla aktarıldı! Şimdi fotoğraf seçip yayına alabilirsiniz.`);
      setTimeout(() => setSuccessMessage(''), 3500);
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

  // Start editing an existing article from the list
  const handleStartEdit = (article: Article) => {
    setEditingArticleId(article.id);
    setFileName('');
    setTitle(article.title);
    setSubtitle(article.subtitle || '');
    setIntroParagraph(article.introParagraph || '');
    
    // Combine sections to editable text
    const sectionsText = article.sections
      .map((s) => `### ${s.heading}\n\n${s.paragraphs.join('\n\n')}`)
      .join('\n\n');
    setBodyText(sectionsText);

    setCategory(article.category);
    setSubCategory(article.subCategory);
    setRegion(article.region || 'Europe');
    setAuthorName(article.author.name);
    setAuthorRole(article.author.role);
    setCoverUrl(article.coverImage || DEFAULT_COVER);

    addLog('edit', `Yazı düzenleme moduna alındı: "${article.title}"`);
    setActiveTab('editor');
  };

  // Convert body text back to structured sections
  const parseBodyToSections = (text: string): Article['sections'] => {
    const parts = text.split(/\n(?=### )/);
    const sections: Article['sections'] = [];

    parts.forEach((part) => {
      const trimmed = part.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('### ')) {
        const lines = trimmed.split('\n');
        const heading = lines[0].replace('### ', '').trim();
        const paras = lines.slice(1).map(l => l.trim()).filter(Boolean);
        sections.push({
          heading,
          paragraphs: paras.length > 0 ? paras : ['...'],
        });
      } else {
        const paras = trimmed.split('\n\n').map(l => l.trim()).filter(Boolean);
        if (paras.length > 0) {
          sections.push({
            heading: 'Observations & Notes',
            paragraphs: paras,
          });
        }
      }
    });

    return sections.length > 0 ? sections : [{
      heading: 'Field Observations',
      paragraphs: [text]
    }];
  };

  // Publish or Save Edits
  const handlePublishOrSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Lütfen yazı başlığını doldurun.');
      return;
    }

    const sections = parseBodyToSections(bodyText);
    const fullText = `${title} ${subtitle} ${introParagraph} ${bodyText}`;
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(3, Math.ceil(wordCount / 180));

    const existingArticle = editingArticleId ? articles.find((a) => a.id === editingArticleId) : null;

    const slug =
      existingArticle?.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `story-${Date.now()}`;

    const updatedArticle: Article = {
      id: editingArticleId || `article-${Date.now()}`,
      slug: slug,
      title: title.trim(),
      subtitle: subtitle.trim() || '',
      category: category,
      subCategory: subCategory,
      region: region.trim() || 'Europe',
      coverImage: coverUrl,
      author: {
        name: authorName.trim() || 'Özgür Yaman',
        role: authorRole.trim() || 'Editor-in-Chief & Founder',
      },
      publishedDate: existingArticle?.publishedDate || new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      readTime: `${readTimeMinutes} min read`,
      excerpt: introParagraph ? introParagraph.slice(0, 180).trim() + '...' : (subtitle ? subtitle.slice(0, 180).trim() + '...' : ''),
      introParagraph: introParagraph || subtitle,
      sections: sections,
      tags: [subCategory, region, 'Editorial', 'Curated Story'],
      featured: existingArticle ? existingArticle.featured : true,
      isEditorPick: true,
      affiliateDisclaimer: true,
    };

    if (editingArticleId) {
      onUpdateArticle(updatedArticle);
      addLog('edit', `Yazı ve fotoğraf güncellendi: "${updatedArticle.title}"`);
      setSuccessMessage('Yazı ve fotoğraf başarıyla güncellendi!');
    } else {
      onAddArticle(updatedArticle);
      addLog('publish', `Yeni yazı yayına alındı: "${updatedArticle.title}" (${updatedArticle.readTime})`);
      setSuccessMessage('Yazınız başarıyla yayına alındı!');
    }

    setTimeout(() => {
      onClose();
      onSelectArticle(updatedArticle);
    }, 800);
  };

  const handleCreateNewBlank = () => {
    setEditingArticleId(null);
    setFileName('');
    setTitle('');
    setSubtitle('');
    setIntroParagraph('');
    setBodyText('');
    setCoverUrl(DEFAULT_COVER);
    addLog('upload', 'Boş editör başlatıldı.');
    setActiveTab('editor');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1814]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#E5E0D8] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#2D2924]">
        
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
                {editingArticleId ? 'Yazıyı ve Fotoğrafı Düzenle' : 'Yazı Yükleme & Editoryal Yönetim'}
              </h3>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-3">
            <div className="flex bg-[#EFEAE2] p-1 border border-[#DCD5C9]">
              <button
                type="button"
                onClick={() => {
                  setEditingArticleId(null);
                  setActiveTab('upload');
                }}
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
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 text-xs font-ui transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                  activeTab === 'editor'
                    ? 'bg-[#FFFFFF] text-[#1A1814] shadow-xs'
                    : 'text-[#767064] hover:text-[#1A1814]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-[#9E7B54]" />
                <span>{editingArticleId ? 'Düzenle' : 'Yazı Editörü'}</span>
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
                <span>Yayındaki Yazılar ({articles.length})</span>
              </button>

              {/* ACTION HISTORY TAB */}
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1.5 text-xs font-ui transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-[#FFFFFF] text-[#1A1814] shadow-xs'
                    : 'text-[#767064] hover:text-[#1A1814]'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-[#9E7B54]" />
                <span>İşlem Geçmişi ({actionHistory.length})</span>
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
                  Word dosyasını yükleyin; başlık, yazar ve paragraflar anında aktarılacaktır. Ardından bilgisayarınızdan kapak fotoğrafını seçip tek tıkla yayına alabilirsiniz.
                </p>

                <button
                  type="button"
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-[#1A1814] hover:bg-[#9E7B54] text-[#FFFFFF] text-xs font-ui uppercase tracking-widest font-medium transition-colors inline-flex items-center space-x-2 shadow-xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>Bilgisayardan Word Seç</span>
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleCreateNewBlank}
                  className="text-xs font-ui text-[#9E7B54] hover:text-[#1A1814] font-medium underline cursor-pointer"
                >
                  veya Word dosyası olmadan doğrudan boş editörle yazı yaz
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ARTICLE EDITOR & PHOTO UPLOAD */}
          {activeTab === 'editor' && (
            <form onSubmit={handlePublishOrSave} className="space-y-6 animate-in fade-in">
              {editingArticleId && (
                <div className="p-3 bg-[#FFF9E6] border border-[#E6C665] flex items-center justify-between text-xs font-ui text-[#805B00]">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#B37D00]" />
                    <span>Şu an yayındaki bir yazıyı düzenliyorsunuz: <strong>"{title}"</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateNewBlank}
                    className="flex items-center gap-1 text-[#805B00] hover:text-[#1A1814] font-semibold underline cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Yeni Yazı Moduna Geç</span>
                  </button>
                </div>
              )}

              {/* Photo Upload & Preview Card */}
              <div className="bg-[#FFFFFF] p-5 sm:p-6 border border-[#E5E0D8] space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[#9E7B54] font-ui text-xs uppercase tracking-wider font-semibold">
                    <ImageIcon className="w-4 h-4" />
                    <span>Kapak Fotoğrafı Yükle (Bilgisayardan)</span>
                  </div>
                  <span className="text-[11px] font-ui text-[#8C827A]">
                    Bilgisayarınızdan yüksek kaliteli görsel yükleyin.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-4 aspect-[16/10] bg-[#EFEAE2] border border-[#D8D2C7] overflow-hidden relative group">
                    <img
                      src={coverUrl}
                      alt="Cover Preview"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_COVER;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <input
                      type="file"
                      ref={photoInputRef}
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    <div>
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="px-5 py-2.5 bg-[#1A1814] hover:bg-[#9E7B54] text-[#FFFFFF] text-xs font-ui uppercase tracking-wider font-medium flex items-center space-x-2 transition-colors cursor-pointer shadow-xs"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Bilgisayardan Fotoğraf Yükle</span>
                      </button>
                      <p className="text-[11px] font-ui text-[#767064] mt-1.5">
                        JPG, PNG, WebP formatları desteklenir.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#EFEAE2]">
                      <label className="text-[11px] font-ui text-[#767064] block mb-1">
                        Veya Doğrudan Görsel URL'si Yapıştırın:
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={coverUrl}
                        onChange={(e) => setCoverUrl(e.target.value)}
                        className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-1.5 text-xs font-ui text-[#1A1814] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Metadata Card */}
              <div className="bg-[#FFFFFF] p-5 sm:p-6 border border-[#E5E0D8] space-y-4 shadow-2xs">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-ui font-semibold uppercase tracking-wider text-[#4A453E] block mb-1">
                      Yazı Başlığı *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Slovenia: The Country That Kept Itself Small on Purpose"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3.5 py-2.5 font-display text-lg text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-ui font-semibold uppercase tracking-wider text-[#4A453E] block mb-1">
                      Alt Başlık / Özet
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: How a tiny nation preserved its soul by refusing to become the next Croatia."
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3.5 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-ui text-[#767064] block mb-1">
                      Ana Kategori
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as MainCategory)}
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814]"
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
                      placeholder="Örn: Slovenia"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-ui text-[#767064] block mb-1">
                      Yazar Adı
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814]"
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
                      className="w-full bg-[#FAFAF8] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814]"
                    />
                  </div>
                </div>
              </div>

              {/* Text & Paragraphs Content */}
              <div className="bg-[#FFFFFF] p-5 sm:p-6 border border-[#E5E0D8] space-y-4 shadow-2xs">
                <div>
                  <label className="text-xs font-ui font-semibold uppercase tracking-wider text-[#4A453E] block mb-1">
                    Giriş Paragrafı (Lead Paragraph)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Yazının ilk vurucu paragrafı..."
                    value={introParagraph}
                    onChange={(e) => setIntroParagraph(e.target.value)}
                    className="w-full bg-[#FAFAF8] border border-[#D5CFC5] p-3 text-xs sm:text-sm font-reading text-[#1A1814] leading-[1.8] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                  />
                </div>

                <div>
                  <label className="text-xs font-ui font-semibold uppercase tracking-wider text-[#4A453E] block mb-1">
                    Bölümler & Metin Gövdesi
                  </label>
                  <textarea
                    rows={10}
                    placeholder="Bölüm başlıkları için ### Başlık yazabilirsiniz..."
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    className="w-full bg-[#FAFAF8] border border-[#D5CFC5] p-3 text-xs sm:text-sm font-reading text-[#1A1814] leading-[1.8] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#9E7B54]"
                  />
                </div>

                <div className="pt-3 border-t border-[#EFEAE2]">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#1A1814] hover:bg-[#9E7B54] text-[#FFFFFF] text-sm font-ui uppercase tracking-widest font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-[#C9A882]" />
                    <span>{editingArticleId ? 'Değişiklikleri Kaydet & Yayına Al' : 'Yazıyı Yayına Al ve Sayfayı Aç'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: ARTICLES LIST WITH EDIT & DELETE */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-ui text-[#767064]">
                  Toplam {articles.length} yayında yazı bulunuyor. İstediğiniz yazıyı düzenleyebilir veya fotoğrafını değiştirebilirsiniz.
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setEditingArticleId(null);
                    setActiveTab('upload');
                  }}
                  className="px-3 py-1.5 bg-[#1A1814] hover:bg-[#9E7B54] text-[#FFFFFF] text-xs font-ui flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yeni Yazı Yükle</span>
                </button>
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
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_COVER;
                          }}
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
                      {/* EDIT BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleStartEdit(art)}
                        className="px-3 py-1.5 text-xs font-ui bg-[#FAF6F0] hover:bg-[#9E7B54] text-[#1A1814] hover:text-[#FFFFFF] border border-[#D8D2C7] rounded-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        title="Yazıyı ve Fotoğrafı Düzenle"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#9E7B54]" />
                        <span>Düzenle</span>
                      </button>

                      {/* VIEW BUTTON */}
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

                      {/* DELETE BUTTON */}
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteArticle(art.id);
                          addLog('delete', `Yazı silindi: "${art.title}"`);
                        }}
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

          {/* TAB 4: ACTION HISTORY PENCERESİ */}
          {activeTab === 'history' && (() => {
            const filteredLogs = historyFilter === 'all' 
              ? actionHistory 
              : actionHistory.filter((l) => l.type === historyFilter);

            const publishCount = actionHistory.filter((l) => l.type === 'publish').length;
            const uploadCount = actionHistory.filter((l) => l.type === 'upload').length;
            const editCount = actionHistory.filter((l) => l.type === 'edit').length;
            const photoCount = actionHistory.filter((l) => l.type === 'photo').length;

            return (
              <div className="space-y-6">
                {/* Header and Clear Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5E0D8]">
                  <div>
                    <h4 className="font-display text-xl font-medium text-[#1A1814] flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#D97706]" />
                      <span>Editoryal İşlem Geçmişi (Action History)</span>
                    </h4>
                    <p className="text-xs font-ui text-[#767064] mt-0.5">
                      Yüklenen Word belgeleri, fotoğraf atamaları, editoryal güncellemeler ve silme kayıtları.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={clearHistory}
                      className="px-3 py-1.5 text-xs font-ui font-medium text-[#C0392B] hover:bg-[#FDF2F2] border border-[#F8B4B4] transition-colors cursor-pointer rounded-xs"
                    >
                      Geçmişi Temizle
                    </button>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#FFFFFF] p-3.5 border border-[#E5E0D8] shadow-2xs">
                    <span className="text-[10px] font-ui uppercase tracking-wider text-[#767064] block">Toplam İşlem</span>
                    <span className="font-display text-2xl text-[#1A1814] font-medium">{actionHistory.length}</span>
                  </div>
                  <div className="bg-[#FFFFFF] p-3.5 border border-[#E5E0D8] shadow-2xs">
                    <span className="text-[10px] font-ui uppercase tracking-wider text-[#2E7D32] block">Yayınlanan</span>
                    <span className="font-display text-2xl text-[#2E7D32] font-medium">{publishCount}</span>
                  </div>
                  <div className="bg-[#FFFFFF] p-3.5 border border-[#E5E0D8] shadow-2xs">
                    <span className="text-[10px] font-ui uppercase tracking-wider text-[#9E7B54] block">Word Yükleme</span>
                    <span className="font-display text-2xl text-[#9E7B54] font-medium">{uploadCount}</span>
                  </div>
                  <div className="bg-[#FFFFFF] p-3.5 border border-[#E5E0D8] shadow-2xs">
                    <span className="text-[10px] font-ui uppercase tracking-wider text-[#D97706] block">Düzenleme</span>
                    <span className="font-display text-2xl text-[#D97706] font-medium">{editCount}</span>
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-ui text-[#767064] mr-1">Filtrele:</span>
                  {[
                    { id: 'all', label: 'Tümü' },
                    { id: 'publish', label: 'Yayına Alma' },
                    { id: 'upload', label: 'Word Yükleme' },
                    { id: 'photo', label: 'Fotoğraf' },
                    { id: 'edit', label: 'Düzenleme' },
                    { id: 'delete', label: 'Silme' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setHistoryFilter(filter.id as any)}
                      className={`px-3 py-1 text-xs font-ui font-medium rounded-xs transition-colors cursor-pointer border ${
                        historyFilter === filter.id
                          ? 'bg-[#1A1814] text-[#FAF8F5] border-[#1A1814]'
                          : 'bg-[#FFFFFF] text-[#5C554D] border-[#D8D2C7] hover:border-[#1A1814]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Log List */}
                <div className="bg-[#FFFFFF] border border-[#E5E0D8] divide-y divide-[#EFEAE2] shadow-xs">
                  {filteredLogs.length === 0 ? (
                    <div className="p-8 text-center text-xs font-ui text-[#767064]">
                      Bu filtreye uygun işlem kaydı bulunamadı.
                    </div>
                  ) : (
                    filteredLogs.map((log) => (
                      <div key={log.id} className="p-3.5 sm:p-4 flex items-start space-x-3 hover:bg-[#FAF8F5] transition-colors">
                        <div className="mt-0.5 p-1.5 rounded-full bg-[#FAF6F0] border border-[#EAE4DC]">
                          {log.type === 'publish' && <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />}
                          {log.type === 'upload' && <FileText className="w-4 h-4 text-[#9E7B54]" />}
                          {log.type === 'photo' && <ImageIcon className="w-4 h-4 text-[#2563EB]" />}
                          {log.type === 'edit' && <Edit3 className="w-4 h-4 text-[#D97706]" />}
                          {log.type === 'delete' && <Trash2 className="w-4 h-4 text-[#DC2626]" />}
                        </div>

                        <div className="grow min-w-0">
                          <p className="text-xs sm:text-sm font-ui text-[#1A1814] leading-relaxed">
                            {log.message}
                          </p>
                          <span className="text-[11px] font-ui uppercase tracking-wider text-[#8C827A] mt-0.5 inline-block">
                            İşlem Türü: {log.type.toUpperCase()}
                          </span>
                        </div>

                        <div className="shrink-0 flex items-center space-x-1.5 text-[11px] font-ui text-[#8C827A] bg-[#FAF8F5] px-2 py-1 border border-[#EAE4DC] rounded-xs">
                          <Clock className="w-3 h-3 text-[#9E7B54]" />
                          <span>{log.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

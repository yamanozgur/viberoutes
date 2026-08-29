import React, { useState, useRef, useEffect } from 'react';
import { Article, MainCategory, SubCategory, HomeSection, HotelFeature } from '../types';
import { parseDocxFile, ParsedDocxResult } from '../utils/docxImporter';
import {
  loginEditor,
  logoutEditor,
  onAuthStatusChange,
  logEditorialAction,
  subscribeToEditorialLogs,
  createEditorByAdmin,
  deleteEditorUser,
  subscribeToEditors,
  EditorUser,
  SUPER_ADMIN_EMAIL,
  getCurrentUserRole,
  EditorialLog,
} from '../lib/firestoreService';
import { User as FirebaseUser } from 'firebase/auth';
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
  EyeOff,
  AlertCircle,
  Edit3,
  RotateCcw,
  Plus,
  Activity,
  CheckCircle2,
  Clock,
  Building2,
  Star,
  Lock,
  LogOut,
  Database,
  ShieldCheck,
  Users,
  Shield,
  UserPlus,
  KeyRound,
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onAddArticle: (article: Article) => void;
  onUpdateArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onClearAllArticles?: () => void;
  onSelectArticle: (article: Article) => void;
  initialTab?: 'upload' | 'editor' | 'articles' | 'history';
}

interface ActionLog {
  id: string;
  time: string;
  type: 'upload' | 'edit' | 'publish' | 'delete' | 'photo' | 'auth';
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

export const HOME_SECTIONS: { id: HomeSection; label: string; description: string }[] = [
  { id: 'hero_cover', label: 'Cover Story (Manşet)', description: 'Ana sayfanın en üstündeki ana büyük kapak hikayesi' },
  { id: 'top_stories', label: 'Top Stories Today (Günün Öne Çıkanları)', description: 'Manşetin sağ tarafındaki 01-05 dikey sıralı liste' },
  { id: 'editors_pick', label: 'Editor’s Must-Read (Editörün Seçtikleri)', description: 'Editörün olmazsa olmaz önerileri ve slow travel seçkisi' },
  { id: 'latest', label: 'Latest Stories & Field Reports (Son Yazılar)', description: 'Ana akış ve kültürel dosyalar bölümü' },
  { id: 'none', label: 'Yalnızca Kategori Sayfası', description: 'Ana sayfada özel blokta yer almaz, kategori filtrelerinde listelenir' },
];

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1549918864-48ac978761a4?auto=format&fit=crop&w=1600&q=80';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  articles,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
  onClearAllArticles,
  onSelectArticle,
  initialTab = 'upload',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'editor' | 'articles' | 'history' | 'team'>(initialTab as any);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'editor' | 'author'>('editor');
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Editor Team Management State (Admin only)
  const [editorsList, setEditorsList] = useState<EditorUser[]>([]);
  const [newEditorName, setNewEditorName] = useState('');
  const [newEditorIdentifier, setNewEditorIdentifier] = useState('');
  const [newEditorPassword, setNewEditorPassword] = useState('');
  const [newEditorRole, setNewEditorRole] = useState<'editor' | 'author'>('editor');
  const [isAddingEditor, setIsAddingEditor] = useState(false);
  const [editorAddError, setEditorAddError] = useState('');
  const [editorAddSuccess, setEditorAddSuccess] = useState('');
  const [deleteConfirmUid, setDeleteConfirmUid] = useState<string | null>(null);

  const isSuperAdmin = currentUser?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() || userRole === 'admin';

  useEffect(() => {
    const unsubscribe = onAuthStatusChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        const role = await getCurrentUserRole(user);
        setUserRole(role);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync real-time editor list
  useEffect(() => {
    if (currentUser) {
      const unsubEditors = subscribeToEditors((list) => {
        setEditorsList(list);
      });
      return () => unsubEditors();
    }
  }, [currentUser]);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab as any);
    }
  }, [isOpen, initialTab]);
  
  // Action History Logs with LocalStorage & Firestore real-time synchronization
  const [historyFilter, setHistoryFilter] = useState<'all' | 'upload' | 'edit' | 'publish' | 'delete' | 'photo' | 'auth'>('all');
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
        message: 'Cloud Firestore "viberoutes" veritabanı aktif. Editoryal yönetim modülü hazır.'
      }
    ];
  });

  // Sync real-time logs from Firestore
  useEffect(() => {
    const unsubLogs = subscribeToEditorialLogs((logs) => {
      if (logs && logs.length > 0) {
        setActionHistory(logs);
      }
    });
    return () => unsubLogs();
  }, []);

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

    // Write audit log to Firestore in the cloud
    logEditorialAction(type, message, currentUser?.email || undefined);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authIdentifier.trim() || !authPassword.trim()) {
      setAuthError('Lütfen kullanıcı adı / e-posta ve şifrenizi girin.');
      return;
    }

    setIsAuthSubmitting(true);
    setAuthError('');

    try {
      await loginEditor(authIdentifier, authPassword);
      setSuccessMessage('Giriş başarılı! Hoş geldiniz.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Auth error:', err);
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-email'
      ) {
        setAuthError('Kullanıcı adı / e-posta veya şifre hatalı. Lütfen kontrol edin.');
      } else {
        setAuthError(err.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
      }
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleAddEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEditorIdentifier.trim() || !newEditorPassword.trim()) {
      setEditorAddError('Lütfen kullanıcı adı / e-posta ve şifre belirleyin.');
      return;
    }
    if (newEditorPassword.length < 6) {
      setEditorAddError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setIsAddingEditor(true);
    setEditorAddError('');
    setEditorAddSuccess('');

    try {
      await createEditorByAdmin(
        newEditorIdentifier,
        newEditorPassword,
        newEditorName || newEditorIdentifier,
        newEditorRole
      );
      setEditorAddSuccess(`Editör (${newEditorIdentifier}) başarıyla eklendi ve yetkilendirildi!`);
      setNewEditorName('');
      setNewEditorIdentifier('');
      setNewEditorPassword('');
      addLog('auth', `Yönetici yeni editör oluşturdu: ${newEditorIdentifier}`);
      setTimeout(() => setEditorAddSuccess(''), 4000);
    } catch (err: any) {
      console.error('Add editor error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setEditorAddError('Bu kullanıcı adı / e-posta ile zaten kayıtlı bir editör var.');
      } else {
        setEditorAddError(err.message || 'Editör eklenemedi.');
      }
    } finally {
      setIsAddingEditor(false);
    }
  };

  const handleDeleteEditor = async (uid: string, email: string) => {
    try {
      await deleteEditorUser(uid, email);
      setSuccessMessage(`${email} editör yetkisi kaldırıldı.`);
      setDeleteConfirmUid(null);
      addLog('auth', `Editör hesabı kaldırıldı: ${email}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Delete editor error:', err);
      setErrorMessage(err.message || 'Editör silinemedi.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutEditor();
      setSuccessMessage('Oturum kapatıldı.');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error('Logout error:', err);
    }
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
  const [homeSection, setHomeSection] = useState<HomeSection>('latest');

  // Boutique Hotel & Luxury Stays showcase management
  const [hotels, setHotels] = useState<HotelFeature[]>([]);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [editingHotelIndex, setEditingHotelIndex] = useState<number | null>(null);

  const [hotelName, setHotelName] = useState('');
  const [hotelFormerLife, setHotelFormerLife] = useState('');
  const [hotelLocation, setHotelLocation] = useState('');
  const [hotelPrice, setHotelPrice] = useState('€350 / night');
  const [hotelRating, setHotelRating] = useState('9.4 / 10');
  const [hotelDescription, setHotelDescription] = useState('');
  const [hotelTravelerTip, setHotelTravelerTip] = useState('');
  const [hotelImageUrl, setHotelImageUrl] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop');
  const [hotelAffiliateProvider, setHotelAffiliateProvider] = useState<'Booking.com' | 'Mr & Mrs Smith' | 'Design Hotels' | 'Direct'>('Booking.com');
  const [hotelAffiliateUrl, setHotelAffiliateUrl] = useState('https://www.booking.com');

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
    setHomeSection(article.homeSection || (article.featured ? 'hero_cover' : (article.isPopular ? 'top_stories' : (article.isEditorPick ? 'editors_pick' : 'latest'))));
    setHotels(article.hotelData ? [...article.hotelData] : []);

    addLog('edit', `Yazı düzenleme moduna alındı: "${article.title}"`);
    setActiveTab('editor');
  };

  const handleOpenNewHotelModal = () => {
    setEditingHotelIndex(null);
    setHotelName('');
    setHotelFormerLife('');
    setHotelLocation(region || 'Europe');
    setHotelPrice('€350 / night');
    setHotelRating('9.4 / 10');
    setHotelDescription('');
    setHotelTravelerTip('');
    setHotelImageUrl('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop');
    setHotelAffiliateProvider('Booking.com');
    setHotelAffiliateUrl('https://www.booking.com');
    setShowHotelModal(true);
  };

  const handleEditHotel = (index: number) => {
    const h = hotels[index];
    if (!h) return;
    setEditingHotelIndex(index);
    setHotelName(h.name);
    setHotelFormerLife(h.formerLife || '');
    setHotelLocation(h.location);
    setHotelPrice(h.priceStarting || '€350 / night');
    setHotelRating(h.rating || '9.4 / 10');
    setHotelDescription(h.description);
    setHotelTravelerTip(h.travelerTip || '');
    setHotelImageUrl(h.imageUrl);
    setHotelAffiliateProvider(h.affiliateProvider || 'Booking.com');
    setHotelAffiliateUrl(h.affiliateUrl || 'https://www.booking.com');
    setShowHotelModal(true);
  };

  const handleSaveHotel = () => {
    if (!hotelName.trim()) {
      setErrorMessage('Lütfen otel adını doldurun.');
      return;
    }
    const newHotel: HotelFeature = {
      name: hotelName.trim(),
      formerLife: hotelFormerLife.trim() || undefined,
      location: hotelLocation.trim() || region || 'Europe',
      description: hotelDescription.trim() || `${hotelName} is a curated sanctuary celebrating architectural heritage and sense of place.`,
      designHighlight: hotelFormerLife.trim() || 'Architectural integrity and curated interiors',
      priceStarting: hotelPrice.trim() || '€350 / night',
      travelerTip: hotelTravelerTip.trim() || 'Book an upper-floor suite for panoramic historic views.',
      affiliateProvider: hotelAffiliateProvider,
      affiliateUrl: hotelAffiliateUrl.trim() || 'https://www.booking.com',
      imageUrl: hotelImageUrl.trim() || DEFAULT_COVER,
      rating: hotelRating.trim() || '9.4 / 10',
    };

    if (editingHotelIndex !== null) {
      setHotels((prev) => prev.map((item, idx) => (idx === editingHotelIndex ? newHotel : item)));
      addLog('edit', `Butik otel güncellendi: "${newHotel.name}"`);
    } else {
      setHotels((prev) => [...prev, newHotel]);
      addLog('edit', `Yazıya butik otel eklendi: "${newHotel.name}"`);
    }
    setShowHotelModal(false);
    setErrorMessage('');
  };

  const handleDeleteHotel = (index: number) => {
    setHotels((prev) => prev.filter((_, idx) => idx !== index));
    addLog('delete', 'Butik otel listeden kaldırıldı.');
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
      hotelData: hotels.length > 0 ? hotels : undefined,
      tags: [subCategory, region, 'Editorial', 'Curated Story'],
      featured: homeSection === 'hero_cover',
      isPopular: homeSection === 'top_stories' || homeSection === 'hero_cover',
      isEditorPick: homeSection === 'editors_pick' || homeSection === 'top_stories',
      homeSection: homeSection,
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
    setHotels([]);
    setCoverUrl(DEFAULT_COVER);
    addLog('upload', 'Boş editör başlatıldı.');
    setActiveTab('editor');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A1814]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#E5E0D8] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#2D2924]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FFFFFF] border-b border-[#E8E3DA] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#D8D2C7] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#9E7B54]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-ui uppercase tracking-[0.25em] text-[#8C827A] block font-semibold">
                  EDITORIAL DESK
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-ui bg-[#FAF8F5] text-[#665E54] border border-[#DCD5C9] font-medium">
                  <Database className="w-3 h-3 text-[#9E7B54]" />
                  <span>viberoutes</span>
                </span>
              </div>
              <h3 className="font-display text-2xl font-light text-[#1A1814]">
                {currentUser ? (editingArticleId ? 'Yazıyı ve Fotoğrafı Düzenle' : 'Yazı Yükleme & Editoryal Yönetim') : 'Editör Giriş Portalı'}
              </h3>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <>
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF8F5] border border-[#E5E0D8] text-[11px] font-ui text-[#524B43]">
                  <User className="w-3.5 h-3.5 text-[#9E7B54]" />
                  <span className="font-semibold text-[#1A1814] truncate max-w-[150px]">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </div>

                <div className="flex bg-[#EFEAE2] p-1 border border-[#DCD5C9] overflow-x-auto max-w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingArticleId(null);
                      setActiveTab('upload');
                    }}
                    className={`px-3 py-1.5 text-xs font-ui transition-all cursor-pointer font-medium flex items-center gap-1.5 whitespace-nowrap ${
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
                    className={`px-3 py-1.5 text-xs font-ui transition-all cursor-pointer font-medium flex items-center gap-1.5 whitespace-nowrap ${
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
                    className={`px-3 py-1.5 text-xs font-ui transition-all cursor-pointer font-medium flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === 'articles'
                        ? 'bg-[#FFFFFF] text-[#1A1814] shadow-xs'
                        : 'text-[#767064] hover:text-[#1A1814]'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Yayındaki Yazılar ({articles.length})</span>
                  </button>

                  {/* EDITORS & TEAM MANAGEMENT TAB */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('team')}
                    className={`px-3 py-1.5 text-xs font-ui transition-all cursor-pointer font-medium flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === 'team'
                        ? 'bg-[#FFFFFF] text-[#1A1814] shadow-xs'
                        : 'text-[#767064] hover:text-[#1A1814]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-[#9E7B54]" />
                    <span>Editörler ({editorsList.length > 0 ? editorsList.length : 1})</span>
                  </button>

                  {/* ACTION HISTORY TAB */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className={`px-3 py-1.5 text-xs font-ui transition-all cursor-pointer font-medium flex items-center gap-1.5 whitespace-nowrap ${
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
                  onClick={handleLogout}
                  title="Oturumu Kapat"
                  className="px-2.5 py-1.5 text-xs font-ui text-[#767064] hover:text-[#9B1C1C] hover:bg-[#FDF2F2] border border-[#DCD5C9] rounded-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>
              </>
            ) : null}

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

          {/* AUTHENTICATION GATE: Shown when editor is not logged in */}
          {!currentUser ? (
            <div className="max-w-md mx-auto my-6 bg-[#FFFFFF] border border-[#E5E0D8] p-7 sm:p-8 shadow-xs space-y-5">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-full bg-[#FAF6F0] border border-[#D8D2C7] flex items-center justify-center mx-auto text-[#9E7B54]">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-display text-xl text-[#1A1814]">
                  Editör & Yönetici Girişi
                </h4>
                <p className="text-xs font-ui text-[#767064] leading-relaxed">
                  Vibe Routes editoryal paneline erişmek, içerik yüklemek ve <strong className="text-[#1A1814] font-medium">"viberoutes"</strong> bulut veritabanını yönetmek için giriş yapın.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-[#FDF2F2] border border-[#F8B4B4] text-xs font-ui text-[#9B1C1C] flex items-start gap-2 rounded-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-ui uppercase tracking-wider font-semibold text-[#4A453E] block mb-1">
                    Kullanıcı Adı veya E-posta
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="yamanozgur veya editör e-postanız"
                    value={authIdentifier}
                    onChange={(e) => setAuthIdentifier(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-hidden focus:border-[#9E7B54]"
                  />
                  <span className="text-[10px] font-ui text-[#8C827A] mt-1 block">
                    Örn: <strong className="text-[#5C554D]">yamanozgur@gmail.com</strong> veya <strong className="text-[#5C554D]">yamanozgur</strong>
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-ui uppercase tracking-wider font-semibold text-[#4A453E] block mb-1">
                    Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Şifrenizi girin"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-hidden focus:border-[#9E7B54] pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#1A1814] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthSubmitting}
                  className="w-full py-2.5 bg-[#1A1814] hover:bg-[#9E7B54] text-[#FFFFFF] text-xs font-ui uppercase tracking-widest font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 mt-2"
                >
                  {isAuthSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Giriş Yapılıyor...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Panele Giriş Yap</span>
                    </>
                  )}
                </button>
              </form>

              {/* Security info banner */}
              <div className="pt-3 text-center border-t border-[#EAE4DC] space-y-1 text-[11px] font-ui text-[#767064]">
                <div className="flex items-center justify-center gap-1.5 text-[#5C554D] font-medium">
                  <Shield className="w-3.5 h-3.5 text-[#9E7B54]" />
                  <span>Yetkili Erişim Koruması</span>
                </div>
                <p className="text-[10px] text-[#8C827A] leading-normal">
                  Yeni editör tanımlamaları güvenlik amacıyla yalnızca Ana Yönetici tarafından panel içerisinden yapılabilir.
                </p>
              </div>
            </div>
          ) : (
            <>
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

                {/* Homepage Section Placement Selector */}
                <div className="pt-2 bg-[#F5F2EC] p-3.5 border border-[#E0D9CD]">
                  <label className="text-xs font-ui font-semibold uppercase tracking-wider text-[#1A1814] block mb-1.5 flex items-center justify-between">
                    <span>Ana Sayfa Vitrin Bölümü</span>
                    <span className="text-[11px] font-normal text-[#767064] lowercase">
                      {HOME_SECTIONS.find((s) => s.id === homeSection)?.description}
                    </span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {HOME_SECTIONS.map((sec) => (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setHomeSection(sec.id)}
                        className={`p-2.5 text-left border transition-all cursor-pointer ${
                          homeSection === sec.id
                            ? 'bg-[#1A1814] text-[#FAF8F5] border-[#1A1814] shadow-xs'
                            : 'bg-[#FFFFFF] text-[#2D2924] border-[#D5CFC5] hover:border-[#9E7B54]'
                        }`}
                      >
                        <div className="font-ui text-xs font-semibold">{sec.label}</div>
                        <div className={`text-[10px] mt-0.5 line-clamp-1 ${
                          homeSection === sec.id ? 'text-[#D5CFC5]' : 'text-[#767064]'
                        }`}>
                          {sec.description}
                        </div>
                      </button>
                    ))}
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

                {/* Boutique Hotel & Sanctuaries Showcase Section */}
                <div className="pt-4 border-t border-[#E5E0D8] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#9E7B54]" />
                        <h4 className="text-xs font-ui font-bold uppercase tracking-wider text-[#1A1814]">
                          Boutique Stays & Lüks Otel Vitrini (Bölüm: Historic Sanctuaries)
                        </h4>
                      </div>
                      <p className="text-[11px] font-ui text-[#767064] mt-0.5">
                        Bu yazıya eklenen butik oteller ana sayfadaki "Boutique Stays & Historic Sanctuaries" bölümünde fiyat ve rezervasyon butonuyla vitrine çıkarılır.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenNewHotelModal}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#9E7B54] text-[#1A1814] hover:text-[#FFFFFF] border border-[#D8D2C7] text-xs font-ui font-medium rounded-xs transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Butik Otel Ekle</span>
                    </button>
                  </div>

                  {hotels.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {hotels.map((h, idx) => (
                        <div
                          key={idx}
                          className="bg-[#FAFAF8] border border-[#E5E0D8] p-3 flex items-start gap-3 relative group"
                        >
                          <div className="w-16 h-16 bg-[#E8E3DA] shrink-0 overflow-hidden border border-[#D8D2C7]">
                            <img
                              src={h.imageUrl}
                              alt={h.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = DEFAULT_COVER;
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 grow">
                            <div className="flex items-center justify-between">
                              <h5 className="font-display text-sm font-semibold text-[#1A1814] truncate">
                                {h.name}
                              </h5>
                              <span className="text-[10px] font-ui font-semibold text-[#9E7B54] bg-[#FAF6F0] px-1.5 py-0.5 border border-[#E5E0D8]">
                                {h.priceStarting}
                              </span>
                            </div>
                            <p className="text-[11px] font-ui text-[#767064] truncate mt-0.5">
                              {h.formerLife ? `${h.formerLife} • ` : ''}{h.location}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => handleEditHotel(idx)}
                                className="text-[10px] font-ui text-[#0284C7] hover:underline cursor-pointer font-medium"
                              >
                                Düzenle
                              </button>
                              <span className="text-[#D5CFC5]">•</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteHotel(idx)}
                                className="text-[10px] font-ui text-[#C0392B] hover:underline cursor-pointer font-medium"
                              >
                                Kaldır
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-[#FAFAF8] border border-dashed border-[#D8D2C7] text-center">
                      <p className="text-xs font-ui text-[#767064]">
                        Henüz bu yazıya butik otel vitrini eklenmedi. (İsteğe bağlı: Butik otel ekleyerek ana sayfada vitrin oluşturabilirsiniz.)
                      </p>
                    </div>
                  )}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="text-xs font-ui text-[#767064]">
                  Toplam {articles.length} yayında yazı bulunuyor. İstediğiniz yazıyı düzenleyebilir veya fotoğrafını değiştirebilirsiniz.
                </span>

                <div className="flex items-center gap-2">
                  {onClearAllArticles && articles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Tüm yayındaki yazıları silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
                          onClearAllArticles();
                          addLog('delete', 'Tüm yayındaki yazılar temizlendi.');
                          setSuccessMessage('Tüm yazılar başarıyla temizlendi.');
                          setTimeout(() => setSuccessMessage(''), 2500);
                        }
                      }}
                      className="px-3 py-1.5 bg-[#FDF2F2] hover:bg-[#FDE8E8] text-[#C0392B] border border-[#F8B4B4] text-xs font-ui flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Tüm yazıları temizle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Tümünü Temizle</span>
                    </button>
                  )}

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
                        <div className="flex items-center space-x-3 text-xs font-ui text-[#767064] mt-0.5">
                          <span>{art.author.name}</span>
                          <span>•</span>
                          <span>{art.category}</span>
                          <span>•</span>
                          <span className={`px-1.5 py-0.2 text-[10px] uppercase font-semibold border ${
                            art.homeSection === 'hero_cover' || (!art.homeSection && art.featured)
                              ? 'bg-[#1A1814] text-[#FAF8F5] border-[#1A1814]'
                              : art.homeSection === 'top_stories'
                              ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                              : art.homeSection === 'editors_pick'
                              ? 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]'
                              : 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]'
                          }`}>
                            {art.homeSection === 'hero_cover' || (!art.homeSection && art.featured)
                              ? 'Manşet'
                              : art.homeSection === 'top_stories'
                              ? 'Top Stories'
                              : art.homeSection === 'editors_pick'
                              ? 'Editor’s Pick'
                              : 'Latest / Akış'}
                          </span>
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

          {/* TAB 5: EDITORS & TEAM MANAGEMENT */}
          {activeTab === 'team' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#E5E0D8]">
                    <div>
                      <h4 className="font-display text-xl text-[#1A1814] flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#9E7B54]" />
                        <span>Editör & Yazar Ekibi Yönetimi</span>
                      </h4>
                      <p className="text-xs font-ui text-[#767064] mt-0.5">
                        Vibe Routes editoryal paneline erişebilecek editörleri tanımlayın veya yetkilerini kaldırın.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-ui bg-[#FAF6F0] text-[#9E7B54] px-2.5 py-1 border border-[#E5DFD5] font-semibold flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Yönetici: {isSuperAdmin ? 'Özgür Yaman (Tam Yetkili)' : 'Editör'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Add New Editor Form */}
                  <div className="bg-[#FFFFFF] border border-[#E5E0D8] p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#EFEAE2]">
                      <UserPlus className="w-4 h-4 text-[#9E7B54]" />
                      <h5 className="font-display text-base text-[#1A1814] font-medium">
                        Yeni Editör Tanımla
                      </h5>
                    </div>

                    {editorAddError && (
                      <div className="p-3 bg-[#FDF2F2] border border-[#F8B4B4] text-xs font-ui text-[#9B1C1C] flex items-start gap-2 rounded-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{editorAddError}</span>
                      </div>
                    )}

                    {editorAddSuccess && (
                      <div className="p-3 bg-[#F2F7F2] border border-[#B7DDB7] text-xs font-ui text-[#1E4620] flex items-start gap-2 rounded-xs">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#2E7D32]" />
                        <span>{editorAddSuccess}</span>
                      </div>
                    )}

                    <form onSubmit={handleAddEditor} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-ui uppercase tracking-wider font-semibold text-[#4A453E] block mb-1">
                            Editör Adı Soyadı
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Örn: Ahmet Yılmaz"
                            value={newEditorName}
                            onChange={(e) => setNewEditorName(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-hidden focus:border-[#9E7B54]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-ui uppercase tracking-wider font-semibold text-[#4A453E] block mb-1">
                            Kullanıcı Adı veya E-posta
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Örn: ahmetyilmaz veya ahmet@gmail.com"
                            value={newEditorIdentifier}
                            onChange={(e) => setNewEditorIdentifier(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-hidden focus:border-[#9E7B54]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-ui uppercase tracking-wider font-semibold text-[#4A453E] block mb-1">
                            Giriş Şifresi
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="En az 6 karakter (Örn: vibe2026)"
                            value={newEditorPassword}
                            onChange={(e) => setNewEditorPassword(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-hidden focus:border-[#9E7B54]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-ui uppercase tracking-wider font-semibold text-[#4A453E] block mb-1">
                            Yetki / Rol
                          </label>
                          <select
                            value={newEditorRole}
                            onChange={(e) => setNewEditorRole(e.target.value as any)}
                            className="w-full bg-[#FAF8F5] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814] focus:bg-[#FFFFFF] focus:outline-hidden focus:border-[#9E7B54]"
                          >
                            <option value="editor">Editör (Yazı Yükleme, Düzenleme ve Yayına Alma)</option>
                            <option value="author">Yazar (Taslak Oluşturma ve Hazırlama)</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          disabled={isAddingEditor}
                          className="px-5 py-2 bg-[#1A1814] hover:bg-[#9E7B54] text-[#FFFFFF] text-xs font-ui uppercase tracking-widest font-semibold transition-colors cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-50"
                        >
                          {isAddingEditor ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Hesap Oluşturuluyor...</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Editör Hesabını Oluştur</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Registered Team / Editors List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-display text-base text-[#1A1814] font-medium flex items-center gap-2">
                        <span>Yetkili Editör Kadrosu</span>
                        <span className="text-xs font-ui text-[#8C827A] font-normal">
                          ({editorsList.length > 0 ? editorsList.length : 1} Kullanıcı)
                        </span>
                      </h5>
                    </div>

                    <div className="bg-[#FFFFFF] border border-[#E5E0D8] divide-y divide-[#EFEAE2] shadow-xs">
                      {/* Super Admin Row (Always visible and protected) */}
                      <div className="p-4 flex items-center justify-between flex-wrap gap-3 bg-[#FAF8F5]">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[#1A1814] text-[#FAF8F5] flex items-center justify-center font-display font-medium text-sm">
                            ÖY
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-ui font-semibold text-sm text-[#1A1814]">
                                Özgür Yaman
                              </span>
                              <span className="px-2 py-0.5 text-[10px] font-ui bg-[#FAF6F0] text-[#9E7B54] border border-[#E5DFD5] font-semibold rounded-xs flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                <span>Ana Yönetici (Super Admin)</span>
                              </span>
                            </div>
                            <div className="text-xs font-ui text-[#767064] mt-0.5">
                              yamanozgur@gmail.com • Sistem Sahibi
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-ui text-[#8C827A]">
                          <Lock className="w-3.5 h-3.5 text-[#9E7B54]" />
                          <span>Korumalı Yönetici Hesabı</span>
                        </div>
                      </div>

                      {/* Custom Added Editors */}
                      {editorsList
                        .filter((ed) => ed.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase())
                        .map((editor) => (
                          <div
                            key={editor.uid}
                            className="p-4 flex items-center justify-between flex-wrap gap-3 hover:bg-[#FAF8F5] transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#D8D2C7] text-[#9E7B54] flex items-center justify-center font-display font-medium text-sm">
                                {editor.displayName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-ui font-medium text-sm text-[#1A1814]">
                                    {editor.displayName}
                                  </span>
                                  <span className="px-2 py-0.5 text-[10px] font-ui bg-[#FFFFFF] text-[#5C554D] border border-[#DCD5C9] font-medium rounded-xs capitalize">
                                    {editor.role === 'author' ? 'Yazar' : 'Editör'}
                                  </span>
                                </div>
                                <div className="text-xs font-ui text-[#767064] mt-0.5">
                                  {editor.email}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {deleteConfirmUid === editor.uid ? (
                                <div className="flex items-center gap-1.5 bg-[#FDF2F2] p-1.5 border border-[#F8B4B4] rounded-xs">
                                  <span className="text-[11px] font-ui text-[#9B1C1C] mr-1">Silinsin mi?</span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteEditor(editor.uid, editor.email)}
                                    className="px-2 py-0.5 bg-[#DC2626] text-white text-[11px] font-ui font-semibold rounded-2xs cursor-pointer hover:bg-[#B91C1C]"
                                  >
                                    Evet, Kaldır
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmUid(null)}
                                    className="px-2 py-0.5 bg-[#FFFFFF] text-[#5C554D] border border-[#D5CFC5] text-[11px] font-ui font-medium rounded-2xs cursor-pointer hover:bg-[#F3F4F6]"
                                  >
                                    İptal
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmUid(editor.uid)}
                                  className="px-2.5 py-1.5 text-xs font-ui text-[#767064] hover:text-[#DC2626] hover:bg-[#FDF2F2] border border-[#E5E0D8] hover:border-[#F8B4B4] rounded-xs transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Yetkiyi Kaldır</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Boutique Stay / Hotel Editor Modal */}
      {showHotelModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#1A1814]/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] border border-[#E5E0D8] w-full max-w-xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto text-[#2D2924]">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#9E7B54]" />
                <h3 className="font-display text-lg font-medium text-[#1A1814]">
                  {editingHotelIndex !== null ? 'Butik Oteli Düzenle' : 'Yeni Butik Otel Ekle'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHotelModal(false)}
                className="p-1 text-[#767064] hover:text-[#1A1814] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-[11px] font-ui font-semibold uppercase text-[#4A453E] block mb-1">
                  Otel Adı *
                </label>
                <input
                  type="text"
                  placeholder="Örn: Reschio Estate, Son Blanc Farmhouse, Aman Venice..."
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-ui font-semibold uppercase text-[#4A453E] block mb-1">
                    Tarihi Kökeni / Eski Hayatı (Former Life)
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: 10th-century Umbrian Castle"
                    value={hotelFormerLife}
                    onChange={(e) => setHotelFormerLife(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-ui font-semibold uppercase text-[#4A453E] block mb-1">
                    Lokasyon / Bölge
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Umbria, Italy veya Menorca, Spain"
                    value={hotelLocation}
                    onChange={(e) => setHotelLocation(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-ui font-semibold uppercase text-[#4A453E] block mb-1">
                    Başlangıç Fiyatı (Price Starting)
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: €380 / night"
                    value={hotelPrice}
                    onChange={(e) => setHotelPrice(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-ui font-semibold uppercase text-[#4A453E] block mb-1">
                    Puan / Rating
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: 9.6 / 10"
                    value={hotelRating}
                    onChange={(e) => setHotelRating(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-ui font-semibold uppercase text-[#4A453E] block mb-1">
                  Kısa Tanıtım & Tasarım Kimliği
                </label>
                <textarea
                  rows={2}
                  placeholder="Otelin mimari dokusu ve sunduğu deneyim..."
                  value={hotelDescription}
                  onChange={(e) => setHotelDescription(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D5CFC5] p-2.5 text-xs font-ui text-[#1A1814]"
                />
              </div>

              <div>
                <label className="text-[11px] font-ui font-semibold uppercase text-[#4A453E] block mb-1">
                  Gezgin İpucu (Traveler Tip)
                </label>
                <input
                  type="text"
                  placeholder="Örn: Request the Tower Suite with private terrace sunset vistas."
                  value={hotelTravelerTip}
                  onChange={(e) => setHotelTravelerTip(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814]"
                />
              </div>

              <div>
                <label className="text-[11px] font-ui font-semibold uppercase text-[#4A453E] block mb-1">
                  Fotoğraf URL'si (Unsplash veya Doğrudan Link)
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={hotelImageUrl}
                  onChange={(e) => setHotelImageUrl(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-ui font-semibold uppercase text-[#4A453E] block mb-1">
                    Rezervasyon Sağlayıcı
                  </label>
                  <select
                    value={hotelAffiliateProvider}
                    onChange={(e) => setHotelAffiliateProvider(e.target.value as any)}
                    className="w-full bg-[#FFFFFF] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814]"
                  >
                    <option value="Booking.com">Booking.com</option>
                    <option value="Mr & Mrs Smith">Mr & Mrs Smith</option>
                    <option value="Design Hotels">Design Hotels</option>
                    <option value="Direct">Direct / Otel Resmi Sitesi</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-ui font-semibold uppercase text-[#4A453E] block mb-1">
                    Rezervasyon Linki (Affiliate URL)
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={hotelAffiliateUrl}
                    onChange={(e) => setHotelAffiliateUrl(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#D5CFC5] px-3 py-2 text-xs font-ui text-[#1A1814]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => setShowHotelModal(false)}
                className="px-4 py-2 text-xs font-ui text-[#5C554D] hover:bg-[#EAE4DC] rounded-xs cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSaveHotel}
                className="px-5 py-2 bg-[#1A1814] hover:bg-[#9E7B54] text-[#FFFFFF] text-xs font-ui uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
              >
                {editingHotelIndex !== null ? 'Değişikliği Kaydet' : 'Otele Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

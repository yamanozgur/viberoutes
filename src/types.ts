export type MainCategory = 'destinations' | 'experiences' | 'stay' | 'lists' | 'gear' | 'the-life';

export type SubCategory =
  // Destinations
  | 'Europe' | 'Asia' | 'Middle East' | 'Africa' | 'Americas' | 'Oceania'
  // Experiences
  | 'Hidden Gems' | 'Solo Travel' | 'Digital Nomad' | 'Train Journeys' | 'UNESCO Sites'
  // Stay
  | 'Design Hotels' | 'Treehouse Hotels' | 'Desert Hotels' | 'Infinity Pools' | 'Converted Buildings'
  // Lists
  | 'Instagram Spots' | 'Best Of' | 'Seasonal Guides'
  // Gear
  | 'Luggage' | 'Packing Guides'
  // The Life
  | 'Nomad Life' | 'Solo Travel Philosophy' | 'Cultural Essays';

export interface HotelFeature {
  name: string;
  formerLife?: string; // e.g. "19th-Century State Bank Vault" or "17th-Century Olive Mill"
  architect?: string;  // e.g. "Studio Ilse / Ilse Crawford"
  location: string;
  description: string;
  designHighlight: string;
  priceStarting: string;
  travelerTip: string;
  affiliateProvider: 'Booking.com' | 'Mr & Mrs Smith' | 'Design Hotels' | 'Direct';
  affiliateUrl: string;
  imageUrl: string;
  rating?: string;
  coordinates?: { lat: number; lng: number };
}

export interface ListItem {
  rank: number;
  title: string;
  subtitle?: string;
  location: string;
  description: string;
  whySpecial: string;
  insiderTip: string;
  affiliateLink?: {
    text: string;
    url: string;
    provider: string;
    price?: string;
  };
  imageUrl: string;
}

export interface GearItem {
  name: string;
  brand: string;
  specs: string[];
  verdict: string;
  pros: string[];
  cons?: string[];
  price: string;
  affiliateProvider: 'Amazon' | 'Carl Friedrik' | 'Rimowa' | 'Brand Direct';
  affiliateUrl: string;
  imageUrl: string;
  weight: string;
  dimensions: string;
}

export interface ArticleContentSection {
  heading?: string;
  paragraphs: string[];
  quote?: string;
  image?: {
    url: string;
    caption: string;
    credit?: string;
  };
  highlightBox?: {
    title: string;
    text: string;
  };
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: MainCategory;
  subCategory: SubCategory;
  region: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedDate: string;
  readTime: string;
  excerpt: string;
  introParagraph: string;
  sections: ArticleContentSection[];
  conclusion?: string;
  hotelData?: HotelFeature[];
  listItems?: ListItem[];
  gearData?: GearItem[];
  tags: string[];
  featured?: boolean;
  isPopular?: boolean;
  isEditorPick?: boolean;
  affiliateDisclaimer?: boolean;
  externalUrl?: string;
  isExternalLink?: boolean;
  ambientSoundtrack?: {
    title: string;
    type: 'rain' | 'temple' | 'cafe' | 'train' | 'ocean';
  };
}

export interface MagazinePage {
  pageNumber: number;
  title: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  bodyPreview: string;
  quote?: string;
}

export interface EMagazineIssue {
  id: string;
  issueNumber: number;
  title: string;
  subtitle: string;
  theme: string;
  monthYear: string;
  pageCount: number;
  coverImage: string;
  description: string;
  editorNote: string;
  editorName: string;
  downloadSize: string;
  tableOfContents: {
    section: string;
    page: number;
    description: string;
  }[];
  previewPages: MagazinePage[];
  isExclusive?: boolean;
}

export interface AmbientVideo {
  id: string;
  title: string;
  location: string;
  country: string;
  duration: string;
  camera: string;
  soundType: string;
  description: string;
  thumbnailUrl: string;
  videoPlaceholderUrl?: string;
  category: string;
}

export interface CuratedRoute {
  id: string;
  title: string;
  duration: string;
  targetVibe: string;
  idealFor: string;
  stops: {
    place: string;
    highlight: string;
    stayRecommendation: string;
    stayAffiliateUrl: string;
  }[];
  heroImage: string;
}

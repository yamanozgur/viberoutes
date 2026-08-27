import { EMagazineIssue } from '../types';

export const MAGAZINE_ISSUES: EMagazineIssue[] = [
  {
    id: 'issue-01-hotel-as-experience',
    issueNumber: 1,
    title: 'The Hotel as Experience',
    subtitle: 'Converted Buildings, Treehouse Architecture & Desert Sanctuaries',
    theme: 'Adaptive Reuse & Monastic Luxury',
    monthYear: 'March 2026',
    pageCount: 28,
    coverImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85',
    description: 'Our premier launch edition investigates the philosophical shift from hotel as temporary shelter to hotel as cultural destination. Featuring deep-dives into 15 bank vault and monastery conversions, architectural sketches, and exclusive interviews with master hospitality designers.',
    editorNote: 'Welcome to the inaugural issue of Vibe Routes. We believe that true travel begins when you slow down and pay exquisite attention to the textures of your shelter. In this edition, we celebrate architects who treat historic buildings not as museums to preserve under glass, but as living containers for contemporary life.',
    editorName: 'Julian Hayes',
    downloadSize: '24.8 MB PDF',
    tableOfContents: [
      { section: 'Editor’s Letter: Space & Memory', page: 2, description: 'Why the modern traveler seeks tension in historic structures.' },
      { section: 'Cover Dossier: 15 Converted Landmarks', page: 6, description: 'From 1920s London vaults to 19th-century Antwerp chapels.' },
      { section: 'Curated Stay: Trunk (Hotel) Yoyogi Park', page: 16, description: 'Japanese oak and Danish hygge above Tokyo’s green canopy.' },
      { section: 'The Minimalist Wardrobe: 48-Hour Weekender', page: 22, description: 'Tested carry-on essentials for the design-conscious traveler.' },
      { section: 'Hidden Escapes: The Black Sand of Jembrana', page: 26, description: 'Bali beyond tourist corridors.' }
    ],
    previewPages: [
      {
        pageNumber: 1,
        title: 'VIBE ROUTES — ISSUE 01',
        subtitle: 'The Hotel as Experience',
        category: 'Cover & Masthead',
        imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
        bodyPreview: 'Published in March 2026. A 28-page high-production digital edition exploring adaptive reuse in contemporary global hospitality.',
        quote: 'A hotel room should not insulate you from a city; it should be an acoustic amplifier of its history.'
      },
      {
        pageNumber: 6,
        title: 'Vaults & Cloisters',
        subtitle: 'The 15 Most Brilliant Adaptive Reuse Hotels in Europe',
        category: 'Main Feature',
        imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
        bodyPreview: 'When Studio Ilse redesigned Ett Hem in Stockholm, they removed the check-in reception desk entirely. Guests walk through a heavy carved oak doorway directly into a domestic salon where a crackling wood fire and fresh Swedish flowers scent the air.',
        quote: 'Luxury is the feeling of entering a private home where every detail was curated for your calm.'
      },
      {
        pageNumber: 16,
        title: 'Architectural Silence in Tokyo',
        subtitle: 'How Keiji Ashizawa & Norm Architects Built a Forest Sanctuary in Shibuya',
        category: 'Destination Guide',
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        bodyPreview: 'Tactile off-shutter concrete meets warm honey-toned oak louvres that filter the morning Tokyo sunlight into soft amber geometric bars across the bed linen.',
      },
      {
        pageNumber: 22,
        title: 'The Industrial Tool',
        subtitle: 'Evaluating Anodized Aluminium & Japanese Hinomoto Bearings',
        category: 'Gear & Craft',
        imageUrl: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80',
        bodyPreview: 'Why the discerning traveler refuses nylon zippers and embraces locking aluminium frames for lifetime durability.',
      }
    ],
    isExclusive: false
  },
  {
    id: 'issue-02-go-alone',
    issueNumber: 2,
    title: 'Go Alone',
    subtitle: 'The Art of Solo Exploration, Female Solitude & Nomad Philosophy',
    theme: 'Solitude & The Open Gaze',
    monthYear: 'April 2026',
    pageCount: 26,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
    description: 'An unflinching investigation into why traveling by oneself remains the most transformative act of adult life. Includes our 15 best solo female routes, safe boutique retreats, and remote work retreats for mature creatives.',
    editorNote: 'Solitude is not a state of lack; it is a clearing. When the conversational chatter of daily life falls away, the world around you becomes intensely cinematic and vividly real.',
    editorName: 'Julian Hayes',
    downloadSize: '22.1 MB PDF',
    tableOfContents: [
      { section: 'Editor’s Note: The Untranslated Self', page: 2, description: 'Why solitude resets our social conditioning.' },
      { section: 'Solo Female Travel: The Top 15 Escapes', page: 5, description: 'From Kyoto onsen ryokans to quiet Portuguese coastal villages.' },
      { section: 'Digital Nomadism at 40', page: 14, description: 'Moving past co-living dorms into design apartment living.' },
      { section: 'Essays: Dining Alone in Paris & Tokyo', page: 20, description: 'The ritual of the counter seat and the single glass of wine.' }
    ],
    previewPages: [
      {
        pageNumber: 1,
        title: 'VIBE ROUTES — ISSUE 02',
        subtitle: 'Go Alone: The Solitary Gaze',
        category: 'Cover & Masthead',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        bodyPreview: '26 pages of literary essays, route maps, and curated solo sanctuaries across five continents.',
        quote: 'You do not travel alone to find yourself; you travel alone to let the old self dissolve.'
      },
      {
        pageNumber: 5,
        title: '15 Safe & Rewarding Solo Stays',
        subtitle: 'Where Solo Guests Are Treated with Dignity & Quiet Hospitality',
        category: 'Curated Guide',
        imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
        bodyPreview: 'At Beniya Mukayu in Yamashiro Onsen, solo travelers find private open-air cypress baths overlooking red pine trees and seasonal kaiseki served in private tatami rooms.'
      }
    ],
    isExclusive: true
  },
  {
    id: 'issue-03-hidden',
    issueNumber: 3,
    title: 'Hidden',
    subtitle: 'Overlooked UNESCO Sites, Southeast Asian Sanctuaries & Deep Tohoku Winter',
    theme: 'The Untravelled Map',
    monthYear: 'May 2026',
    pageCount: 30,
    coverImage: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1200&q=85',
    description: 'Focusing on geography bypassed by mass tourism: the sub-zero onsen villages of northern Japan, forgotten Khmer temples in southern Laos, and Patagonian autumn fjords.',
    editorNote: 'Overtourism is a problem of imagination. While millions line up for selfies in Venice and Santorini, thousands of kilometers of sublime, culturally rich terrain remain untouched.',
    editorName: 'Julian Hayes',
    downloadSize: '27.4 MB PDF',
    tableOfContents: [
      { section: 'Editor’s Note: Beyond the Itinerary', page: 2, description: 'The courage to take the unpaved branch line.' },
      { section: 'Tohoku in Heavy Snow', page: 6, description: 'Yamabushi ascetics, steam onsen and cedar forests in winter.' },
      { section: '10 UNESCO Sites Nobody Talks About', page: 18, description: 'Forgotten architectural marvels across 4 continents.' },
      { section: 'Southeast Asia: 15 Hidden Gems', page: 24, description: 'The archipelago islands far beyond the backpacker trail.' }
    ],
    previewPages: [
      {
        pageNumber: 1,
        title: 'VIBE ROUTES — ISSUE 03',
        subtitle: 'Hidden: The Untravelled Map',
        category: 'Cover & Masthead',
        imageUrl: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80',
        bodyPreview: '30 pages of rare cartography, long-form documentary essays, and field notes from the edge of the tourist map.'
      }
    ],
    isExclusive: true
  }
];

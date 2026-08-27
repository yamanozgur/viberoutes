import { CuratedRoute, AmbientVideo } from '../types';

export const CURATED_ROUTES: CuratedRoute[] = [
  {
    id: 'route-japan-winter-tohoku-kyoto',
    title: 'The Silent Japanese Winter: From Tokyo Kissaten to Tohoku Snow Onsens',
    duration: '14 Days',
    targetVibe: 'Monastic Calm & Deep Snow',
    idealFor: 'Solo Travelers & Cultured Couples',
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    stops: [
      {
        place: 'Tokyo (Tomigaya & Jinbocho)',
        highlight: 'Antiquarian book browsing, Nel drip kissaten, and modernist architecture at Yoyogi.',
        stayRecommendation: 'Trunk (Hotel) Yoyogi Park',
        stayAffiliateUrl: 'https://www.mrandmrssmith.com/luxury-hotels/trunk-hotel-yoyogi-park?aff=viberoutes'
      },
      {
        place: 'Ginzan Onsen (Yamagata Prefecture)',
        highlight: 'Taisho-era timber ryokans lining a frozen river with steam rising into falling evening snow.',
        stayRecommendation: 'Notoya Ryokan (Design Heritage)',
        stayAffiliateUrl: 'https://www.booking.com/hotel/jp/notoya-ryokan.html?aid=viberoutes'
      },
      {
        place: 'Kanazawa & Shirakawa-go',
        highlight: '21st Century Museum of Contemporary Art by SANAA and thatched farmsteads under heavy snowpack.',
        stayRecommendation: 'Kumu Kanazawa by The Share Hotels',
        stayAffiliateUrl: 'https://www.booking.com/hotel/jp/kumu-kanazawa.html?aid=viberoutes'
      },
      {
        place: 'Kyoto (Arashiyama & Philosopher’s Path)',
        highlight: 'Moss gardens dusted in frost and private cedar onsen baths.',
        stayRecommendation: 'Suiran, a Luxury Collection Hotel',
        stayAffiliateUrl: 'https://www.mrandmrssmith.com/luxury-hotels/suiran-kyoto?aff=viberoutes'
      }
    ]
  },
  {
    id: 'route-scandinavian-design-light',
    title: 'The Scandinavian Architecture & Natural Wine Circuit',
    duration: '10 Days',
    targetVibe: 'Minimalist Architecture & Food',
    idealFor: 'Design Enthusiasts & Child-Free Couples',
    heroImage: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80',
    stops: [
      {
        place: 'Copenhagen (Nordhavn & Vesterbro)',
        highlight: 'Bespoke bicycle rides along the harbor, cardamom buns at Lille Bakery, and natural wine at Den Vandrette.',
        stayRecommendation: 'The Audo (Audo Copenhagen)',
        stayAffiliateUrl: 'https://www.mrandmrssmith.com/luxury-hotels/the-audo?aff=viberoutes'
      },
      {
        place: 'Stockholm (Lärkstaden & Archipelago)',
        highlight: 'Modernist furniture galleries in Östermalm and wooden saunas on remote granite islands.',
        stayRecommendation: 'Ett Hem Stockholm',
        stayAffiliateUrl: 'https://www.mrandmrssmith.com/luxury-hotels/ett-hem?aff=viberoutes'
      }
    ]
  }
];

export const AMBIENT_VIDEOS: AmbientVideo[] = [
  {
    id: 'video-ginzan-snow',
    title: 'Heavy Snowfall at Ginzan Onsen',
    location: 'Yamagata Prefecture',
    country: 'Japan',
    duration: '6:20 min',
    camera: 'Lumix S9 (Cinematic V-Log, Warm Neutral LUT)',
    soundType: 'Natural Soundscape: Snow crunch, river currents, distant wooden clogs (geta)',
    description: 'A quiet observational lens on dusk settling over a 100-year-old onsen river canyon. No music, no narration.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
    category: 'Winter Atmospheres'
  },
  {
    id: 'video-patagonia-dawn',
    title: 'Dawn Mist Over Lake Pehoé',
    location: 'Torres del Paine',
    country: 'Chile',
    duration: '7:45 min',
    camera: 'Lumix S9 / 32-bit Float Ambient Audio',
    soundType: 'Glacial water laps, mountain wind in lenga trees, guanaco calls',
    description: 'Watching the morning sun illuminate the granite horns of Los Cuernos in deep autumn solitude.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80',
    category: 'Silent Wilderness'
  },
  {
    id: 'video-kyoto-bamboo-rain',
    title: 'Rain on Bamboo Leaves at Sagano',
    location: 'Kyoto',
    country: 'Japan',
    duration: '5:15 min',
    camera: 'Lumix S9 (Kinfolk/Monocle aesthetic)',
    soundType: 'Gentle monsoon rain, wind through hollow bamboo trunks, distant temple bell',
    description: 'A meditative study in green and grey textures inside the ancient grove at 6:00 AM before gates open.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    category: 'Meditative Spaces'
  }
];

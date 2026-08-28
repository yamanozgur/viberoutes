import { Article } from '../types';

export const ARTICLES_DATA: Article[] = [
  {
    id: 'dublin-where-conversation-never-ends',
    slug: 'dublin-where-conversation-never-ends',
    title: 'Dublin: Where the Conversation Never Really Ends',
    subtitle: 'A guide to literary ghosts, amber-lit Victorian pubs, Georgian squares, and the art of staying indoors gracefully.',
    category: 'destinations',
    subCategory: 'Europe',
    region: 'Ireland',
    coverImage: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?q=80&w=1600&auto=format&fit=crop',
    author: {
      name: 'Özgür Yaman',
      role: 'Editor-in-Chief & Founder',
    },
    publishedDate: 'August 2026',
    readTime: '8 min read',
    excerpt: 'A city that has spent centuries perfecting the art of staying indoors gracefully — with good beer, better conversation, and a fire going in the corner.',
    introParagraph: `It is raining when you arrive in Dublin. It was probably raining when the last person arrived, and it will almost certainly be raining when you leave. And yet, somewhere between the grey sky and the wet cobblestones, something unexpected happens: you stop minding. A city that has spent centuries perfecting the art of staying indoors gracefully — with good beer, better conversation, and a fire going in the corner — has very little to fear from the weather.

Dublin is compact enough to walk across in an afternoon, yet layered enough to keep you occupied for a week. Its literary ghosts are everywhere — Joyce at the breakfast table, Beckett on the canal bank, Wilde leaning against a railing in Merrion Square with that particular expression of his. The River Liffey cuts the city in two, Georgian terraces line the southern streets, and around almost every corner, a pub glows amber through its windows like a lantern left on for you specifically.

This is not a city that performs for tourists, though it welcomes them warmly. It simply carries on being itself — and being itself, it turns out, is quite enough.`,
    sections: [
      {
        heading: 'Temple Bar and Trinity College: Where It All Begins',
        paragraphs: [
          'Most people find their way to Temple Bar within hours of arriving, and there is nothing wrong with that. Yes, it is the tourist quarter. Yes, it is loud and a little chaotic on a Friday night. But come at four in the afternoon on a weekday and it is something else entirely: a busker working through a slow reel on a fiddle, the smell of rain on warm stone, a handful of people leaning outside a pub with pints in hand, talking about nothing in particular. That version of Temple Bar is worth finding.',
          "Ha'penny Bridge — the city's slender, cast-iron footbridge — arches over the Liffey just nearby. Cross it in either direction and pause halfway. Below you, the river moves with quiet purpose. Around you, the city hums. It is one of those unremarkable moments that you somehow remember for years.",
          'A short walk away, Trinity College opens up into something altogether quieter. The Long Room library — all dark wood, vaulted ceilings, and the faint, particular smell of old paper — is one of those rooms that makes you feel slightly better about being human. The Book of Kells, illuminated by monks over twelve centuries ago, sits in a case nearby and is precisely as extraordinary as everyone says. Budget more time than you think you need. You will want to linger.'
        ],
        quote: 'The Long Room library — all dark wood, vaulted ceilings, and the faint, particular smell of old paper — is one of those rooms that makes you feel slightly better about being human.',
        image: {
          url: 'https://images.unsplash.com/photo-1590497507303-34e8be3d226a?q=80&w=1200&auto=format&fit=crop',
          caption: 'The vaulted Long Room of Trinity College Library, home to over 200,000 rare historical volumes.',
          credit: 'Vibe Routes Archive'
        }
      },
      {
        heading: "St. Stephen's Green and Grafton Street: The Quieter Pleasures",
        paragraphs: [
          "St. Stephen's Green is where Dubliners come to remember that they live in a city with a park in the middle of it. On a mild morning, office workers eat lunch on the benches, children run at the ducks who want nothing to do with them, and older men read newspapers with the unhurried patience of people who have nowhere particular to be. It is one of the most pleasant places in the city to do absolutely nothing.",
          'Grafton Street runs north from the park — pedestrianised, busy, lined with the kind of shops you find in every European city centre, but redeemed by the quality of its street musicians. Just off it, Powerscourt Townhouse is a restored Georgian mansion that now houses boutique shops and a handful of excellent cafés. It is the right place for a mid-morning coffee and a moment of quiet before the city gets going again.'
        ],
        highlightBox: {
          title: 'Curator’s Morning Tip',
          text: 'Step off Grafton Street into Powerscourt Townhouse Center. Grab an espresso at the atrium café to admire the plasterwork ceilings before the shopping crowds arrive.'
        }
      },
      {
        heading: "The Pub: Dublin's True Living Room",
        paragraphs: [
          'There is a particular moment that happens in a Dublin pub, usually around nine in the evening. The room has filled without anyone noticing. A musician in the corner has started playing — not announced, not amplified, just started — and somewhere along the bar, a conversation that began about football has wandered, as all good conversations do, into something more interesting. A stranger buys you a drink because it seemed like the right thing to do.',
          `Some iconic pubs worth finding:
- The Temple Bar Pub — The historic corner with fiddle players who bring the room alive.
- Davy Byrne’s — Joyce sent Leopold Bloom here for a gorgonzola sandwich and a glass of burgundy in Ulysses.
- The Long Hall — Victorian mirrors, dark wood, and a bar polished by a century of elbows.
- Grogan’s — Tucked near St. Stephen’s Green, beloved by artists and writers for simple toasties and unfiltered charm.`
        ]
      }
    ],
    hotelData: [
      {
        name: 'The Shelbourne',
        formerLife: 'Historic 1824 Grande Dame',
        architect: 'Victorian Landmark / Guy Oliver Restoration',
        location: '27 St. Stephen’s Green, Dublin 2',
        description: 'The undisputed grande dame of Dublin hotels, overlooking St. Stephen’s Green since 1824. Classic without being stiff; the kind of place that wears its history lightly with legendary afternoon tea and the historic Horseshoe Bar.',
        designHighlight: 'Original Georgian high-ceilinged drawing rooms and historic Constitution Room',
        priceStarting: '€420 / night',
        travelerTip: 'Order a dry martini at the Horseshoe Bar where politicians, poets, and locals have gathered for two centuries.',
        affiliateProvider: 'Booking.com',
        affiliateUrl: 'https://www.booking.com',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop',
        rating: '9.4 / 10'
      },
      {
        name: 'The Dean Dublin',
        formerLife: 'Boutique Georgian Conversion',
        architect: 'ODOS Architects',
        location: '33 Camden St Lower, Dublin 2',
        description: 'On vibrant Camden Street, with a panoramic rooftop glasshouse bar (Sophie’s) and bespoke rooms featuring custom Marshall amps, turntable setups, and bold contemporary Irish artwork.',
        designHighlight: 'Rooftop glasshouse restaurant & custom vinyl listening stations in-room',
        priceStarting: '€210 / night',
        travelerTip: 'Book a Hi-Fi room and enjoy rooftop sunset drinks before heading down to Camden Street’s music venues.',
        affiliateProvider: 'Design Hotels',
        affiliateUrl: 'https://www.designhotels.com',
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop',
        rating: '8.9 / 10'
      }
    ],
    tags: ['Dublin', 'Ireland', 'Literary Travel', 'Pub Culture', 'Boutique Hotels', 'City Guide', 'Europe'],
    featured: true,
    isPopular: true,
    isEditorPick: true,
    homeSection: 'hero_cover'
  },
  {
    id: 'mexico-beyond-cancun-8-destinations',
    slug: 'mexico-beyond-cancun-8-destinations',
    title: 'Mexico Beyond Cancun: 8 Destinations That Show You What Mexico Actually Is',
    subtitle: 'From the stone courtyards of Oaxaca to the modernist architecture of Mexico City and the secret emerald cenotes of Yucatan.',
    category: 'destinations',
    subCategory: 'Americas',
    region: 'Mexico',
    coverImage: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=1600&auto=format&fit=crop',
    author: {
      name: 'Özgür Yaman',
      role: 'Editor-in-Chief & Founder',
    },
    publishedDate: 'August 2026',
    readTime: '10 min read',
    excerpt: 'Cancun is not Mexico. It was a deliberate construction — a resort zone built on a sandbar in the 1970s. The real country is found in cloud-forest mezcal palenques and colonial courtyards.',
    introParagraph: `Cancun is not Mexico. It was a deliberate construction — a resort zone built on a sandbar in the 1970s by the Mexican government's tourism agency using computer models. It serves a purpose, but it tells you nothing about the country that surrounds it.

The real Mexico is one of the world's great cultural civilizations — ancient, layered, complex, endlessly generous, and deeply proud. It is a place of sixteenth-century convent courtyards overgrown with bougainvillea, mountain valleys where indigenous languages are spoken before Spanish, markets that smell of dried chilies, roasted cacao, and copal incense.`,
    sections: [
      {
        heading: 'Oaxaca: The Culinary and Artistic Heartbeat',
        paragraphs: [
          'Oaxaca City sits in a central valley ringed by mountains, paved with green volcanic cantera stone that glows after afternoon thunderstorms. It is widely considered the culinary capital of Mexico, and that reputation is well earned.',
          'Here, food is not merely nourishment; it is an unbroken lineage stretching back thousands of years. In the Mercado 20 de Noviembre, the smoke from grilling tasajo and cecina hangs in the air alongside the fragrance of seven distinct regional moles.'
        ],
        quote: 'In Oaxaca, food is an unbroken lineage stretching back thousands of years.',
        image: {
          url: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?q=80&w=1200&auto=format&fit=crop',
          caption: 'Cobbled colonial streets and vibrant cantera stone facades of Oaxaca City.',
          credit: 'Vibe Routes Archive'
        }
      },
      {
        heading: 'San Miguel de Allende & Guanajuato: The Silver Cities',
        paragraphs: [
          'Further north in the central highlands, the former silver mining cities offer a completely different architectural spectacle. San Miguel de Allende is renowned for its pink neo-Gothic parish church, terracotta rooftop terraces, and thriving artisan studios.',
          'Next door, Guanajuato is an impossibly colorful labyrinth built into a narrow ravine, where traffic flows through subterranean stone tunnels beneath vibrant colonial plazas.'
        ]
      }
    ],
    hotelData: [
      {
        name: 'Criollo & Hotel Sin Nombre',
        formerLife: '17th-century Oaxacan Casona',
        architect: 'Boutique Conservation Studio',
        location: 'Calle 20 de Noviembre, Oaxaca Centro',
        description: 'A restored 17th-century mansion featuring vaulted stone archways, artisanal clay tiles, and an interior plunge pool illuminated by central skylights.',
        designHighlight: 'Minimalist sand-colored plasterwork and local Zapotec textile accents',
        priceStarting: '$280 / night',
        travelerTip: 'Enjoy breakfast in the open-air central courtyard with freshly ground hot chocolate and Oaxacan pan de yema.',
        affiliateProvider: 'Design Hotels',
        affiliateUrl: 'https://www.designhotels.com',
        imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop',
        rating: '9.5 / 10'
      }
    ],
    tags: ['Mexico', 'Oaxaca', 'Culinary Travel', 'Americas', 'Colonial Architecture', 'Hidden Gems'],
    featured: false,
    isPopular: true,
    isEditorPick: true,
    homeSection: 'top_stories'
  },
  {
    id: 'dubai-desert-sanctuaries-avant-garde',
    slug: 'dubai-desert-sanctuaries-avant-garde',
    title: 'Dubai: Desert Sanctuaries, Hidden Art Districts & The New Luxury Wave',
    subtitle: 'Beyond the supertalls lies a quiet world of protected desert dunes, heritage wind towers, and bespoke design hideaways.',
    category: 'destinations',
    subCategory: 'Middle East',
    region: 'United Arab Emirates',
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop',
    author: {
      name: 'Özgür Yaman',
      role: 'Editor-in-Chief & Founder',
    },
    publishedDate: 'August 2026',
    readTime: '7 min read',
    excerpt: 'Step away from the skyline and discover the raw stillness of the Dubai Desert Conservation Reserve and the artistic pulse of Alserkal Avenue.',
    introParagraph: `There are two Dubais. The first is familiar to anyone with a screen: the soaring glass needles, the monumental fountains, the spectacle of a metropolis that rose from coastal sands in a single generation.

The second Dubai is quieter, older, and far more compelling. It is found in the ochre silence of the desert dunes at dawn, where Arabian oryx wander across pristine ridges. It lives along the Creek in the historic Al Fahidi neighbourhood, where traditional barjeel wind towers catch the maritime breeze.`,
    sections: [
      {
        heading: 'The Desert Sanctuaries: Silence in the Ochre Dunes',
        paragraphs: [
          'Just forty-five minutes from the coast, the Dubai Desert Conservation Reserve protects over 225 square kilometres of untamed desert wilderness. Here, luxury means complete acoustic stillness, starlit dining under the Arabian night sky, and bespoke Bedouin hospitality.',
          'Watching the sunrise paint the rippling dunes in gold and terracotta while falcons soar on morning thermals is one of the region’s truly unforgettable moments.'
        ],
        quote: 'Here, luxury means complete acoustic stillness and starlit skies over ancient sand dunes.',
        image: {
          url: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=1200&auto=format&fit=crop',
          caption: 'Morning mist rising over protected desert dunes outside Dubai.',
          credit: 'Vibe Routes Archive'
        }
      },
      {
        heading: 'Alserkal Avenue and the Creative District',
        paragraphs: [
          'In the industrial neighbourhood of Al Quoz, warehouse district Alserkal Avenue has evolved into the cultural heart of the contemporary Gulf. Independent contemporary art galleries, artisan coffee roasters, private screening rooms, and concept design boutiques line its pedestrian lanes.'
        ]
      }
    ],
    hotelData: [
      {
        name: 'Al Maha, Desert Resort & Spa',
        formerLife: 'Luxury Bedouin Encampment Sanctuary',
        architect: 'Arabian Heritage Architecture',
        location: 'Dubai Desert Conservation Reserve',
        description: 'An exclusive oasis set deep within the dunes, offering individual Bedouin tented suites with private temperature-controlled infinity pools overlooking roaming gazelles.',
        designHighlight: 'Handcrafted Arabian antiques and private panoramic pool decks',
        priceStarting: '$950 / night',
        travelerTip: 'Take the complimentary sunset camel trek into the dunes with champagne and dates.',
        affiliateProvider: 'Marriott Luxury',
        affiliateUrl: 'https://www.marriott.com',
        imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1000&auto=format&fit=crop',
        rating: '9.8 / 10'
      }
    ],
    tags: ['Dubai', 'Middle East', 'Desert Sanctuaries', 'Luxury Hotels', 'Architecture', 'Culture'],
    featured: false,
    isPopular: true,
    isEditorPick: true,
    homeSection: 'top_stories'
  },
  {
    id: 'kyoto-after-hours-zen-machiya',
    slug: 'kyoto-after-hours-zen-machiya',
    title: 'Kyoto After Hours: Gion Lanterns, Ancient Machiya & Temple Gardens',
    subtitle: 'How to experience Japan’s ancient imperial capital in absolute stillness, away from the daytime crowds.',
    category: 'destinations',
    subCategory: 'Asia',
    region: 'Japan',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop',
    author: {
      name: 'Özgür Yaman',
      role: 'Editor-in-Chief & Founder',
    },
    publishedDate: 'August 2026',
    readTime: '9 min read',
    excerpt: 'When the tour buses leave and the stone lanterns flicker on along the Shirakawa River, Kyoto transforms into the poetic masterpiece it has been for twelve centuries.',
    introParagraph: `To truly experience Kyoto, you must set your alarm for dawn or wait until the blue hour descends upon the Higashiyama hills.

During the middle of the day, the ancient capital can feel overwhelmed by modern travel. But walk the cobblestone lanes of Gion at 6:30 in the morning, when the cedar-wood machiya townhouses are still shuttered and temple monks sweep gravel in meditative rhythm, and Kyoto reveals its timeless grace.`,
    sections: [
      {
        heading: 'The Magic of Machiya Living',
        paragraphs: [
          'Machiya are traditional wooden townhouses that define historic Kyoto architecture. Built with narrow street facades and deep courran (tsuboniwa), they are masterclasses in light, shadow, and natural ventilation.',
          'Staying in a restored machiya allows you to experience tatami-matted stillness, soaking in aromatic hinoki wood tubs while rain gently falls on courtyard moss gardens.'
        ],
        quote: 'In a Kyoto machiya, the boundary between interior living and exterior nature dissolves completely.',
        image: {
          url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
          caption: 'Lantern-lit traditional stone alleyways of historic Gion at dusk.',
          credit: 'Vibe Routes Archive'
        }
      }
    ],
    hotelData: [
      {
        name: 'Hoshinoya Kyoto',
        formerLife: '17th-century Riverside Noble Retreat',
        architect: 'Rie Azuma Design',
        location: 'Arashiyama, Kyoto',
        description: 'Reached only by a scenic private wooden boat gliding up the Oi River, this serene sanctuary preserves ancient Japanese craftsmanship with Michelin-caliber kaiseki dining.',
        designHighlight: 'Karakami woodblock printed wallpapers and riverside maple viewing pavilions',
        priceStarting: '¥110,000 / night',
        travelerTip: 'Participate in the morning temple meditation with incense listening (kōdō) led by master practitioners.',
        affiliateProvider: 'Hoshino Resorts',
        affiliateUrl: 'https://hoshinoya.com',
        imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000&auto=format&fit=crop',
        rating: '9.7 / 10'
      }
    ],
    tags: ['Kyoto', 'Japan', 'Asia', 'Ryokan', 'Zen Gardens', 'Culture', 'Slow Travel'],
    featured: false,
    isPopular: true,
    isEditorPick: true,
    homeSection: 'top_stories'
  },
  {
    id: 'amalfi-coast-autumn-cliffside-villas',
    slug: 'amalfi-coast-autumn-cliffside-villas',
    title: 'The Amalfi Coast in Autumn: Quiet Terraces, Lemon Groves & Solitary Cliffs',
    subtitle: 'Why October and November are the golden secret season for Italy’s most cinematic shoreline.',
    category: 'stay',
    subCategory: 'Europe',
    region: 'Italy',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1600&auto=format&fit=crop',
    author: {
      name: 'Özgür Yaman',
      role: 'Editor-in-Chief & Founder',
    },
    publishedDate: 'August 2026',
    readTime: '8 min read',
    excerpt: 'When the summer yachts disperse and the Tyrrhenian sea turns deep cobalt, Positano and Ravello return to the slow, lemon-scented rhythm of authentic Campania life.',
    introParagraph: `In midsummer, the Amalfi Coast is a dizzying carnival of traffic and sun loungers. But arrive in late autumn, and the dramatic vertical landscape belonging to Homer's sirens returns to pure poetry.

The sea retains its warmth from months of Mediterranean sun, the hillside pergolas are heavy with sfusato amalfitano lemons, and table reservations at legendary cliffside trattorias no longer require months of tactical planning.`,
    sections: [
      {
        heading: 'Ravello: Suspended Between Sky and Sea',
        paragraphs: [
          'Perched 350 meters above the sea, Ravello has always been the refuge for thinkers, composers, and poets seeking retreat from coastal bustle.',
          'The gardens of Villa Cimbrone and Villa Rufolo, framed by century-old umbrella pines and marble statues looking out over infinity, are among the most romantic vistas on earth.'
        ]
      }
    ],
    hotelData: [
      {
        name: 'Le Sirenuse',
        formerLife: 'Marchese Sersale Summer Palazzo',
        architect: 'Family Private Casona',
        location: 'Positano, Amalfi Coast',
        description: 'An iconic crimson-washed palazzo in the center of Positano filled with museum-quality antiques, hand-painted Vietri tiles, and champagne sunsets on the terrace.',
        designHighlight: 'Handcrafted ceramic tilework and candlelit terraces with views of the bay',
        priceStarting: '€850 / night',
        travelerTip: 'Have an unhurried aperitivo at Franco’s Bar watching the fishing boats return at twilight.',
        affiliateProvider: 'Mr & Mrs Smith',
        affiliateUrl: 'https://www.mrandmrssmith.com',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop',
        rating: '9.9 / 10'
      }
    ],
    tags: ['Italy', 'Amalfi Coast', 'Positano', 'Luxury Hotels', 'Mediterranean', 'Europe', 'Stay'],
    featured: false,
    isPopular: true,
    isEditorPick: true,
    homeSection: 'editors_pick'
  },
  {
    id: 'slovenia-country-kept-itself-small',
    slug: 'slovenia-country-kept-itself-small',
    title: 'Slovenia: The Country That Kept Itself Small on Purpose',
    subtitle: 'How a tiny Alpine-Adriatic nation preserved its soul, emerald rivers, and boutique farm stays by refusing to overdevelop.',
    category: 'destinations',
    subCategory: 'Hidden Gems',
    region: 'Slovenia',
    coverImage: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?q=80&w=1600&auto=format&fit=crop',
    author: {
      name: 'Özgür Yaman',
      role: 'Editor-in-Chief & Founder',
    },
    publishedDate: 'August 2026',
    readTime: '7 min read',
    excerpt: 'With sixty percent of its land covered in virgin forest and strict ecological protection, Slovenia is Europe’s greatest slow-travel sanctuary.',
    introParagraph: `Slovenia is roughly the size of New Jersey, but within its borders it contains Julian Alpine peaks, subterranean karst caves, Mediterranean vineyards, and rivers so impossibly turquoise they look painted.

Rather than chasing mega-resorts and cruise ship terminals, the country chose a different path: organic boutique farms, architectural preservation, and deep respect for the land.`,
    sections: [
      {
        heading: 'The Soča Valley: Emerald Waters & Alpine Serenity',
        paragraphs: [
          'The Soča River carves a dramatic turquoise canyon through the Triglav National Park. Here, wooden suspension bridges sway over crystal rapids, and alpine chalets serve aged Tolminc cheeses with crisp local Rebula wine.'
        ]
      }
    ],
    tags: ['Slovenia', 'Hidden Gems', 'Alps', 'Nature', 'Sustainable Travel', 'Europe'],
    featured: false,
    isPopular: true,
    isEditorPick: true,
    homeSection: 'latest'
  }
];

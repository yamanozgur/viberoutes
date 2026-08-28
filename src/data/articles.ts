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
        heading: 'Kilmainham Gaol and the Guinness Storehouse: History, Then Reward',
        paragraphs: [
          'Kilmainham Gaol is not a comfortable place to visit, and that is precisely the point. The jail where the leaders of the 1916 Easter Rising were executed — walked to the stonebreakers’ yard in the early morning and shot, one by one — is presented without sentimentality and without softening. The guided tour is one of the finest in Ireland, delivered by people who understand that this history still matters. Go in the morning, before the groups arrive, and give yourself time to sit with it afterwards.',
          'The Guinness Storehouse, a short walk away, offers a different kind of experience — and a welcome one after the weight of Kilmainham. Seven floors take you through the history and craft of Ireland’s most famous stout, and the whole thing culminates at the Gravity Bar on the roof: floor-to-ceiling glass, a 360-degree panorama of Dublin spreading out in every direction, and a perfectly poured pint of Guinness placed in your hands. It is, frankly, very good.'
        ],
        image: {
          url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200&auto=format&fit=crop',
          caption: 'Overlooking the copper roofs and river bends of Dublin at dusk.',
          credit: 'Vibe Routes Archive'
        }
      },
      {
        heading: "The Pub: Dublin's True Living Room",
        paragraphs: [
          'There is a particular moment that happens in a Dublin pub, usually around nine in the evening. The room has filled without anyone noticing. A musician in the corner has started playing — not announced, not amplified, just started — and somewhere along the bar, a conversation that began about football has wandered, as all good conversations do, into something more interesting. A stranger buys you a drink because it seemed like the right thing to do. This is what people mean when they talk about Irish hospitality; it is not a performance, it is just how things work here.',
          `**Some pubs worth finding:**

* **The Temple Bar Pub** — The tourists are there, yes, but so is a fiddle player who has been making this place feel alive for twenty years. Don’t let the postcards outside put you off.
* **Davy Byrne’s** — Joyce sent Leopold Bloom here for a gorgonzola sandwich and a glass of burgundy in *Ulysses*. The sandwich is still on the menu. Ordering it feels like a small, private joke with a very dead writer.
* **The Long Hall** — Victorian mirrors, dark wood, and a bar that has been polished by a century of elbows. Come early, find a stool, and stay.
* **Grogan’s** — Tucked near St. Stephen’s Green, beloved by artists and writers and anyone who prefers a good toastie to a cocktail menu. Unpretentious in the best possible sense.
* **The Brazen Head** — Dublin’s oldest pub, open since 1198, which means it has been serving drinks through famine, rebellion, and independence. The history alone justifies the walk.`,
          '**A note on Guinness:** It tastes different here. People say this everywhere about local beers and are usually wrong. In Dublin, they are right.'
        ],
        quote: 'A stranger buys you a drink because it seemed like the right thing to do. This is what people mean when they talk about Irish hospitality; it is not a performance, it is just how things work here.'
      },
      {
        heading: 'Food: Honest, Then Exceptional',
        paragraphs: [
          'Irish food has spent decades shaking off an unfair reputation, and in Dublin the transformation is complete. The foundations remain — hearty, unglamorous, deeply satisfying — but built on top of them is a restaurant scene that takes its ingredients seriously and its cooking seriously, without taking itself too seriously.',
          `**Start with the classics:**
* **Irish Stew** — Lamb, root vegetables, and broth, the kind of dish that makes sense of cold weather in a way that no other cuisine quite manages.
* **Full Irish Breakfast** — Black pudding, white pudding, back bacon, sausages, eggs, and toast. Not every day, but at least once. You will understand the country better for it.
* **Oysters** — Fresh from Galway Bay, briny and cold, best eaten standing at a counter with a glass of something pale and dry.`,
          `**For a more serious evening:**
* **Chapter One** — A Michelin-starred institution in the basement of the Dublin Writers Museum; modern Irish cooking that manages to be both technically accomplished and genuinely warm.
* **Restaurant Patrick Guilbaud** — Two stars, French-Irish in spirit, and one of the finest dining rooms in the country. Book weeks ahead.
* **Glovers Alley or Liath** — For adventurous tasting menus that push at what Irish food can be.

If a Michelin dinner is within reach, do not talk yourself out of it. Reserve early; these tables fill months in advance.`
        ]
      },
      {
        heading: 'A Few Things Worth Adding',
        paragraphs: [
          'Dublin rewards the slightly curious traveller who wanders beyond the obvious. A few additions to the itinerary:',
          `* **Phoenix Park** — Vast, improbably green, and home to a herd of wild fallow deer that graze near the road as if entirely indifferent to the fact that they are inside a European capital.
* **Croke Park** — Attend a Gaelic football or hurling match if the fixtures align. The atmosphere is unlike anything in mainstream European sport — fierce, local, and completely its own thing.
* **EPIC The Irish Emigration Museum** — Interactive and more moving than the format suggests; a genuinely good account of why so many Irish people ended up everywhere else.
* **Live sessions** — Ask at your hotel which pub has the best traditional music session that evening. Then go there, order something, and stay for at least two hours. The music improves as the night deepens.`,
          'The strangest thing about Dublin is how quickly it becomes familiar. After two days, you have a favourite pub. After three, you have a regular coffee order and a route through the park you have decided is better than the other routes. After four, you are explaining to someone who has just arrived which neighbourhoods are worth exploring and which pubs to avoid on weekends. You have become, very briefly, a local.'
        ]
      }
    ],
    conclusion: 'That is what Dublin does. It does not dazzle you into submission the way some cities do. It simply makes room for you, pulls up a stool, and asks what you’re having. Come for a weekend. Stay for as long as you can manage. The conversation, as promised, never really ends.',
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
      },
      {
        name: 'Number 31',
        formerLife: 'Sam Stephenson Modernist & Georgian Townhouse',
        architect: 'Sam Stephenson',
        location: '31 Leeson Close, Dublin 2',
        description: 'A discreet Georgian townhouse on Fitzwilliam Square that functions more like a very well-run private home with an iconic sunken leather lounge and tranquil courtyard.',
        designHighlight: '1970s sunken conversation pit with open peat fireplace and mews garden',
        priceStarting: '€195 / night',
        travelerTip: 'The legendary cooked-to-order breakfast featuring homemade breads and cranberry-orange compote is not to be missed.',
        affiliateProvider: 'Mr & Mrs Smith',
        affiliateUrl: 'https://www.mrandmrssmith.com',
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop',
        rating: '9.6 / 10'
      },
      {
        name: 'The Alex',
        formerLife: 'Contemporary Boutique Residence',
        architect: '21 Spaces Design',
        location: '41-47 Fenian St, Dublin 2',
        description: 'Located minutes from Merrion Square and Grafton Street, offering mid-century velvet tones, industrial copper detailing, and a serene atmosphere designed for creative travelers.',
        designHighlight: 'Mid-century lounge interiors with curated craft cocktail bar',
        priceStarting: '€230 / night',
        travelerTip: 'Take an unhurried morning walk to Oscar Wilde’s memorial in Merrion Square directly across the street.',
        affiliateProvider: 'Booking.com',
        affiliateUrl: 'https://www.booking.com',
        imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop',
        rating: '9.0 / 10'
      }
    ],
    tags: ['Dublin', 'Ireland', 'Literary Travel', 'Pub Culture', 'Boutique Hotels', 'City Guide', 'Europe'],
    featured: true,
    isPopular: true,
    isEditorPick: true
  }
];

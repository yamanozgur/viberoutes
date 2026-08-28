/**
 * Unsplash URL Normalizer and Extractor for Vibe Routes Editorial System
 */

export function normalizeUnsplashUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // If already an images.unsplash.com URL
  if (trimmed.includes('images.unsplash.com/')) {
    // If it has parameters, make sure it has good quality and width
    if (trimmed.includes('?')) {
      const [base] = trimmed.split('?');
      return `${base}?auto=format&fit=crop&w=1600&q=80`;
    }
    return `${trimmed}?auto=format&fit=crop&w=1600&q=80`;
  }

  // Handle standard unsplash.com/photos/[slug-or-id]
  const photoPageMatch = trimmed.match(/unsplash\.com\/photos\/(?:[^\s/?#]+-)?([a-zA-Z0-9_-]+)/i);
  if (photoPageMatch && photoPageMatch[1]) {
    const rawId = photoPageMatch[1];
    // If ID contains photo- prefix or is a photo ID
    const formattedId = rawId.startsWith('photo-') ? rawId : (rawId.length > 8 && /^\d+/.test(rawId) ? `photo-${rawId}` : rawId);
    return `https://images.unsplash.com/${formattedId.startsWith('photo-') ? formattedId : `photo-${formattedId}`}?auto=format&fit=crop&w=1600&q=80`;
  }

  return trimmed;
}

export interface ParsedDraftResult {
  title?: string;
  subtitle?: string;
  authorName?: string;
  authorRole?: string;
  coverImage?: string;
  region?: string;
  intro: string;
  sections: {
    heading: string;
    paragraphs: string[];
    image?: {
      url: string;
      caption?: string;
      credit?: string;
    };
    quote?: string;
  }[];
  extractedUnsplashUrls: string[];
}

export function parseDraftWithUnsplash(rawText: string): ParsedDraftResult {
  const lines = rawText.split('\n');
  const extractedUrls: string[] = [];
  let title = '';
  let subtitle = '';
  let authorName = '';
  let authorRole = '';
  let coverImage = '';
  let region = '';

  const cleanLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      cleanLines.push('');
      continue;
    }

    // Check for metadata tags: [cover: ...], Cover: ..., [photo: ...]
    const coverMatch = line.match(/^(?:\[?(?:cover|kapak|görsel|hero|featured(?:\s*image)?)\s*[:=]\s*\]?)(.+?)(?:\])?$/i);
    if (coverMatch) {
      const url = coverMatch[1].trim().replace(/^\[|\]$/g, '');
      const normalized = normalizeUnsplashUrl(url);
      if (normalized) {
        coverImage = normalized;
        extractedUrls.push(normalized);
        continue;
      }
    }

    // Check for Author metadata: Author: ..., Yazar: ...
    const authorMatch = line.match(/^(?:\[?(?:author|yazar|writer)\s*[:=]\s*\]?)(.+?)(?:\])?$/i);
    if (authorMatch) {
      authorName = authorMatch[1].trim().replace(/^\[|\]$/g, '');
      continue;
    }

    // Check for Role metadata: Role: ..., Rol: ..., Title: ...
    const roleMatch = line.match(/^(?:\[?(?:role|rol|unvan|title_role)\s*[:=]\s*\]?)(.+?)(?:\])?$/i);
    if (roleMatch) {
      authorRole = roleMatch[1].trim().replace(/^\[|\]$/g, '');
      continue;
    }

    // Check for Region / Location metadata: Region: ..., Şehir: ..., Location: ...
    const regionMatch = line.match(/^(?:\[?(?:region|bölge|location|şehir|ülke|country)\s*[:=]\s*\]?)(.+?)(?:\])?$/i);
    if (regionMatch) {
      region = regionMatch[1].trim().replace(/^\[|\]$/g, '');
      continue;
    }

    // Check for Title metadata: Title: ..., Başlık: ...
    const titleMatch = line.match(/^(?:\[?(?:title|başlık)\s*[:=]\s*\]?)(.+?)(?:\])?$/i);
    if (titleMatch && !title) {
      title = titleMatch[1].trim().replace(/^\[|\]$/g, '');
      continue;
    }

    // Check for explicit standalone unsplash URL on its own line
    if (line.startsWith('http') && (line.includes('unsplash.com') || line.includes('images.unsplash.com'))) {
      const normalized = normalizeUnsplashUrl(line);
      if (!coverImage) {
        coverImage = normalized;
      }
      extractedUrls.push(normalized);
      // Keep section photo marker in text as a tag or section photo
      cleanLines.push(`[SECTION_PHOTO: ${normalized}]`);
      continue;
    }

    cleanLines.push(lines[i]);
  }

  // Split into paragraphs
  const cleanBody = cleanLines.join('\n');
  const paragraphs = cleanBody
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  if (paragraphs.length === 0) {
    return {
      title,
      subtitle,
      authorName,
      authorRole,
      coverImage,
      region,
      intro: '',
      sections: [],
      extractedUnsplashUrls: extractedUrls,
    };
  }

  // If title was not explicitly labeled, use first heading or first line if short
  let startIndex = 0;
  if (!title && paragraphs.length > 0) {
    const firstP = paragraphs[0];
    if (firstP.startsWith('# ') || (firstP.length < 100 && !firstP.includes('.') && !firstP.includes('\n'))) {
      title = firstP.replace(/^#+\s*/, '').trim();
      startIndex = 1;
    }
  }

  const remaining = paragraphs.slice(startIndex);
  const intro = remaining.length > 0 ? remaining[0] : '';
  const afterIntro = remaining.slice(1);

  const sections: ParsedDraftResult['sections'] = [];
  let currentHeading = 'Field Observations & Architecture';
  let currentParagraphs: string[] = [];
  let currentSectionImage: { url: string; caption?: string; credit?: string } | undefined = undefined;

  afterIntro.forEach((p) => {
    // Check if paragraph is or contains a section photo tag
    if (p.includes('[SECTION_PHOTO:')) {
      const match = p.match(/\[SECTION_PHOTO:\s*(.+?)\]/);
      if (match && match[1]) {
        currentSectionImage = {
          url: match[1].trim(),
          caption: 'Editorial photo selection',
          credit: 'Unsplash Archive',
        };
        p = p.replace(/\[SECTION_PHOTO:\s*.+?\]/, '').trim();
        if (!p) return;
      }
    }

    // Check if this paragraph is a Heading
    if (
      p.startsWith('#') || 
      (p.length < 90 && (p.endsWith(':') || (p === p.toUpperCase() && p.length > 4 && !p.includes('.'))))
    ) {
      if (currentParagraphs.length > 0) {
        sections.push({
          heading: currentHeading,
          paragraphs: currentParagraphs,
          image: currentSectionImage,
        });
        currentParagraphs = [];
        currentSectionImage = undefined;
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
      image: currentSectionImage,
    });
  }

  return {
    title,
    subtitle,
    authorName,
    authorRole,
    coverImage,
    region,
    intro,
    sections,
    extractedUnsplashUrls: extractedUrls,
  };
}

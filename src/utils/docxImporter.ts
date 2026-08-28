import mammoth from 'mammoth';
import { normalizeUnsplashUrl } from './unsplash';
import { Article, MainCategory, SubCategory } from '../types';

export interface ParsedDocxResult {
  title: string;
  subtitle: string;
  intro: string;
  sections: Article['sections'];
  extractedCoverUrl?: string;
  detectedAuthor?: string;
  detectedRegion?: string;
  wordCount: number;
}

export async function parseDocxFile(file: File): Promise<ParsedDocxResult> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Convert docx to HTML using mammoth
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;

  // Parse HTML into a virtual DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Extract all text elements and links
  const extractedImages: string[] = [];
  const links = doc.querySelectorAll('a');
  links.forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href.includes('unsplash.com')) {
      extractedImages.push(normalizeUnsplashUrl(href));
    }
  });

  // Also check text for raw unsplash urls or inline images
  const images = doc.querySelectorAll('img');
  images.forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (src.startsWith('data:image') || src.includes('unsplash.com')) {
      extractedImages.push(normalizeUnsplashUrl(src));
    }
  });

  const bodyChildren = Array.from(doc.body.children);

  let title = '';
  let subtitle = '';
  let detectedAuthor = '';
  let detectedRegion = '';
  const paragraphs: string[] = [];
  const sections: Article['sections'] = [];
  let currentHeading = '';
  let currentSectionParas: string[] = [];
  let currentSectionImg: { url: string; caption?: string; credit?: string } | undefined = undefined;

  let imgIndex = 1; // index for section images (index 0 is cover if available)

  for (let i = 0; i < bodyChildren.length; i++) {
    const el = bodyChildren[i];
    const text = el.textContent?.trim() || '';
    if (!text && !el.querySelector('img')) continue;

    const tagName = el.tagName.toLowerCase();

    // Check for metadata like Author:, Region:, Cover:
    const authorMatch = text.match(/^(?:Author|Yazar|Writer)\s*:\s*(.+)$/i);
    if (authorMatch) {
      detectedAuthor = authorMatch[1].trim();
      continue;
    }

    const regionMatch = text.match(/^(?:Region|Bölge|Location|Şehir|Ülke)\s*:\s*(.+)$/i);
    if (regionMatch) {
      detectedRegion = regionMatch[1].trim();
      continue;
    }

    const coverMatch = text.match(/^(?:Cover|Kapak|Görsel)\s*:\s*(https?:\/\/.+)$/i);
    if (coverMatch) {
      const parsedUrl = normalizeUnsplashUrl(coverMatch[1].trim());
      if (parsedUrl) {
        extractedImages.unshift(parsedUrl);
      }
      continue;
    }

    // Check if raw text is an unsplash link
    if (text.startsWith('http') && (text.includes('unsplash.com') || text.includes('images.unsplash.com'))) {
      const parsedUrl = normalizeUnsplashUrl(text);
      if (parsedUrl) {
        extractedImages.push(parsedUrl);
      }
      continue;
    }

    // First heading or strong paragraph is title if not set
    if (!title) {
      if (tagName === 'h1' || tagName === 'h2' || (i === 0 && text.length < 120)) {
        title = text;
        continue;
      }
    }

    // Check for Subtitle / Tagline
    if (title && !subtitle && (tagName === 'h3' || (paragraphs.length === 0 && text.length < 160 && !text.includes('.')))) {
      subtitle = text;
      continue;
    }

    // Check if this is a section heading (h1, h2, h3 or short bold text)
    if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || (text.length < 70 && text.endsWith(':'))) {
      if (currentSectionParas.length > 0) {
        sections.push({
          heading: currentHeading || 'Observations',
          paragraphs: currentSectionParas,
          image: currentSectionImg,
        });
        currentSectionParas = [];
        currentSectionImg = undefined;
      }
      currentHeading = text.replace(/:$/, '').trim();
      
      // If there's an unused extracted unsplash image, attach it to this section
      if (extractedImages[imgIndex]) {
        currentSectionImg = {
          url: extractedImages[imgIndex],
          caption: currentHeading,
          credit: 'Unsplash Archive',
        };
        imgIndex++;
      }
      continue;
    }

    // Regular paragraph
    if (text.length > 0) {
      if (currentHeading) {
        currentSectionParas.push(text);
      } else {
        paragraphs.push(text);
      }
    }
  }

  // Push remaining section
  if (currentSectionParas.length > 0) {
    sections.push({
      heading: currentHeading || 'Observations',
      paragraphs: currentSectionParas,
      image: currentSectionImg,
    });
  }

  // If no title found from headings, use file name or first paragraph
  if (!title) {
    title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  }

  const intro = paragraphs.join('\n\n') || (sections[0]?.paragraphs.join('\n\n') || '');

  // Calculate word count
  const allText = `${title} ${subtitle} ${intro} ${sections.map(s => s.paragraphs.join(' ')).join(' ')}`;
  const wordCount = allText.split(/\s+/).filter(Boolean).length;

  return {
    title,
    subtitle: subtitle || intro.slice(0, 140) + '...',
    intro,
    sections,
    extractedCoverUrl: extractedImages[0] || undefined,
    detectedAuthor,
    detectedRegion,
    wordCount,
  };
}

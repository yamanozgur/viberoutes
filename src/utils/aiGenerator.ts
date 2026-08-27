import { GoogleGenAI, Type } from '@google/genai';

// Clean and extract readable text from raw HTML
function extractTextAndMetaFromHtml(html: string) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) || 
                     html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                     html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const rawTitle = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim() : '';

  const descMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const rawDesc = descMatch ? descMatch[1].trim() : '';

  const imgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  const ogImage = imgMatch ? imgMatch[1].trim() : '';

  const cleanedHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const bodySample = cleanedHtml.slice(0, 15000);

  return { rawTitle, rawDesc, ogImage, bodySample };
}

export async function autoGenerateStoryFromUrl(url?: string, rawText?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  let webpageText = rawText || '';
  let ogImage = '';
  let metaTitle = '';
  let metaDesc = '';

  if (url) {
    try {
      const fetchResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'tr,en-US,en;q=0.9',
        },
        redirect: 'follow',
      });

      if (fetchResponse.ok) {
        const html = await fetchResponse.text();
        const extracted = extractTextAndMetaFromHtml(html);
        webpageText = extracted.bodySample;
        ogImage = extracted.ogImage;
        metaTitle = extracted.rawTitle;
        metaDesc = extracted.rawDesc;
      }
    } catch (err) {
      console.warn('Direct web fetch failed:', err);
    }
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are the Senior Editor for "Vibe Routes" luxury travel magazine.
Your task is to take the REAL, ACTUAL text provided below and format it into a pristine magazine story.

SOURCE URL: ${url || 'Direct Text Submission'}
SOURCE META TITLE: ${metaTitle || ''}
SOURCE META DESC: ${metaDesc || ''}

ACTUAL USER CONTENT / WEBPAGE BODY:
"""
${webpageText || '(No text could be extracted from the link)'}
"""

CRITICAL EDITORIAL RULES:
1. STRICT TRUTHFULNESS & ACCURACY: You must faithfully represent the real locations, hotel names, cities, experiences, and perspective mentioned in the source above. DO NOT invent fictitious places or unrelated stories.
2. TITLE: Extract or faithfully reflect the original title in high-end editorial Turkish.
3. SUBTITLE: A concise, sophisticated summary of the real story.
4. COVER IMAGE: If valid og:image ("${ogImage}") is provided, use it. Otherwise, choose a high-resolution Unsplash photo representing the EXACT place discussed in the article.
5. INTRO PARAGRAPH: 2-3 sentences capturing the core mood and thesis of the actual text.
6. SECTIONS: 2-3 logical sub-sections dividing the ACTUAL text into readable magazine chapters with engaging headings.
7. CATEGORY & SUBCATEGORY: Match the actual topic (destinations, stay, experiences, lists, gear, the-life).
8. AUTHOR: Keep author as "Özgür Yaman".
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          category: { 
            type: Type.STRING, 
            enum: ["destinations", "stay", "experiences", "lists", "gear", "the-life"] 
          },
          subCategory: { 
            type: Type.STRING,
            enum: ["Hidden Gems", "Europe", "Asia", "Americas", "Design Hotels", "Converted Buildings", "Solo Travel", "Nomad Life", "Weekend Escapes"]
          },
          region: { type: Type.STRING },
          coverImage: { type: Type.STRING },
          introParagraph: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                paragraphs: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["heading", "paragraphs"]
            }
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          authorName: { type: Type.STRING },
          authorRole: { type: Type.STRING },
          readTime: { type: Type.STRING }
        },
        required: [
          "title", 
          "subtitle", 
          "category", 
          "subCategory", 
          "region", 
          "coverImage", 
          "introParagraph", 
          "sections"
        ]
      }
    }
  });

  if (!response.text) {
    throw new Error('AI failed to generate story content');
  }

  const result = JSON.parse(response.text);
  if (ogImage && !result.coverImage) {
    result.coverImage = ogImage;
  }

  return result;
}

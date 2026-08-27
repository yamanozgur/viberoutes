var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");

// src/utils/aiGenerator.ts
var import_genai = require("@google/genai");
function extractTextAndMetaFromHtml(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) || html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) || html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const rawTitle = titleMatch ? titleMatch[1].replace(/&amp;/g, "&").replace(/&#39;/g, "'").trim() : "";
  const descMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) || html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const rawDesc = descMatch ? descMatch[1].trim() : "";
  const imgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  const ogImage = imgMatch ? imgMatch[1].trim() : "";
  const cleanedHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ").replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, " ").replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, " ").replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const bodySample = cleanedHtml.slice(0, 15e3);
  return { rawTitle, rawDesc, ogImage, bodySample };
}
async function autoGenerateStoryFromUrl(url, rawText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  let webpageText = rawText || "";
  let ogImage = "";
  let metaTitle = "";
  let metaDesc = "";
  if (url) {
    try {
      const fetchResponse = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "tr,en-US,en;q=0.9"
        },
        redirect: "follow"
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
      console.warn("Direct web fetch failed:", err);
    }
  }
  const ai = new import_genai.GoogleGenAI({ apiKey });
  const prompt = `
You are the Senior Editor for "Vibe Routes" luxury travel magazine.
Your task is to take the REAL, ACTUAL text provided below and format it into a pristine magazine story.

SOURCE URL: ${url || "Direct Text Submission"}
SOURCE META TITLE: ${metaTitle || ""}
SOURCE META DESC: ${metaDesc || ""}

ACTUAL USER CONTENT / WEBPAGE BODY:
"""
${webpageText || "(No text could be extracted from the link)"}
"""

CRITICAL EDITORIAL RULES:
1. STRICT TRUTHFULNESS & ACCURACY: You must faithfully represent the real locations, hotel names, cities, experiences, and perspective mentioned in the source above. DO NOT invent fictitious places or unrelated stories.
2. TITLE: Extract or faithfully reflect the original title in high-end editorial Turkish.
3. SUBTITLE: A concise, sophisticated summary of the real story.
4. COVER IMAGE: If valid og:image ("${ogImage}") is provided, use it. Otherwise, choose a high-resolution Unsplash photo representing the EXACT place discussed in the article.
5. INTRO PARAGRAPH: 2-3 sentences capturing the core mood and thesis of the actual text.
6. SECTIONS: 2-3 logical sub-sections dividing the ACTUAL text into readable magazine chapters with engaging headings.
7. CATEGORY & SUBCATEGORY: Match the actual topic (destinations, stay, experiences, lists, gear, the-life).
8. AUTHOR: Keep author as "\xD6zg\xFCr Yaman".
`;
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: import_genai.Type.OBJECT,
        properties: {
          title: { type: import_genai.Type.STRING },
          subtitle: { type: import_genai.Type.STRING },
          category: {
            type: import_genai.Type.STRING,
            enum: ["destinations", "stay", "experiences", "lists", "gear", "the-life"]
          },
          subCategory: {
            type: import_genai.Type.STRING,
            enum: ["Hidden Gems", "Europe", "Asia", "Americas", "Design Hotels", "Converted Buildings", "Solo Travel", "Nomad Life", "Weekend Escapes"]
          },
          region: { type: import_genai.Type.STRING },
          coverImage: { type: import_genai.Type.STRING },
          introParagraph: { type: import_genai.Type.STRING },
          sections: {
            type: import_genai.Type.ARRAY,
            items: {
              type: import_genai.Type.OBJECT,
              properties: {
                heading: { type: import_genai.Type.STRING },
                paragraphs: {
                  type: import_genai.Type.ARRAY,
                  items: { type: import_genai.Type.STRING }
                }
              },
              required: ["heading", "paragraphs"]
            }
          },
          tags: {
            type: import_genai.Type.ARRAY,
            items: { type: import_genai.Type.STRING }
          },
          authorName: { type: import_genai.Type.STRING },
          authorRole: { type: import_genai.Type.STRING },
          readTime: { type: import_genai.Type.STRING }
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
    throw new Error("AI failed to generate story content");
  }
  const result = JSON.parse(response.text);
  if (ogImage && !result.coverImage) {
    result.coverImage = ogImage;
  }
  return result;
}

// server.ts
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/generate-story", async (req, res) => {
    try {
      const { url, rawText } = req.body;
      if (!url && !rawText) {
        return res.status(400).json({ error: "Link veya metin girilmelidir." });
      }
      const generatedStory = await autoGenerateStoryFromUrl(url, rawText);
      return res.json({ success: true, story: generatedStory });
    } catch (error) {
      console.error("Error generating story:", error);
      return res.status(500).json({
        error: error.message || "Failed to auto-generate story"
      });
    }
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map

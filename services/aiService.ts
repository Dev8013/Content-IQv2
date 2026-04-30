
// import * as puter from "puter"; // Removed to use global CDN version for browser compatibility
import { AnalysisType, AnalysisResult } from "../types";

// Declare puter for TypeScript since it's loaded via CDN in index.html
declare const puter: any;

// Helper to handle Puter's global existence
const getPuter = () => {
  if (typeof window !== 'undefined' && (window as any).puter) {
    return (window as any).puter;
  }
  if (typeof puter !== 'undefined') {
    return puter;
  }
  throw new Error("Puter AI link not found. Please refresh or check connection.");
};

const extractYoutubeId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const analyzeContent = async (
  type: AnalysisType,
  input: string | { data: string; mimeType: string },
  instructions: string = ""
): Promise<AnalysisResult> => {
  // Puter AI doesn't require an API key in the browser environment
  
  // REAL IMAGE GENERATION
  if (type === AnalysisType.IMAGE_GEN) {
    try {
      const p = getPuter();
      const prompt = `Create a professional, high-impact YouTube thumbnail art or digital illustration for: ${input}. Style: Cinematic, vibrant, high detail, 16:9 aspect ratio.`;
      const imageElement = await p.ai.txt2img(prompt);
      
      // Convert HTMLImageElement to base64 if possible or use its src
      // In Puter.js, txt2img typically returns an HTMLImageElement in the browser
      let imageUrl = "";
      if (imageElement && imageElement.src) {
        imageUrl = imageElement.src;
      } else {
        throw new Error("Neural Imaging Link Failed: No visual data returned.");
      }

      return {
        summary: "- Neural art generation finalized.\n- Visual assets synchronized to local buffer.\n- Ready for platform export.",
        generatedImageUrl: imageUrl,
        scores: { clarity: 100, engagement: 100, originality: 100, structure: 100, overall: 100 },
        improvements: ["- Use stylistic modifiers like '8k' or 'hyper-realistic' for more refined iterations."],
        tips: { content: "Precise prompts yield superior visual coherence in the neural matrix." }
      };
    } catch (err: any) {
      console.error("Puter Image Gen Error:", err);
      throw new Error(`Neural Imaging Error: ${err.message || "Unknown error"}`);
    }
  }

  // CONTENT ANALYSIS (YOUTUBE, PDF, RESUME, ETC)
  let taskInstruction = "";
  if (type === AnalysisType.YOUTUBE) {
    taskInstruction = "YouTube Video Audit. Extract SEO metadata, titles, and tags.";
  } else if (type === AnalysisType.COMPETITIVE_AUDIT) {
    taskInstruction = `Competitive Channel/Video Audit. Analyze the provided link: "${input}". 
    Identify their SEO strategy, recurring tags, visual branding good/bad practices, and content pillars. 
    Explain what makes them successful or where they are failing.`;
  } else if (type === AnalysisType.CHANNEL_DEEP_DIVE) {
    taskInstruction = `Deep Dive Channel Audit for: "${input}". 
    1. Extract channel metadata (Banner, Avatar, Handle, Subscribers, Total Videos).
    2. Generate a list of their latest 8 videos including thumbnails, titles, views, and relative time.
    3. Analyze overall channel performance, subscriber growth patterns, and view distributions.
    4. Identify good/bad practices and a roadmap to hit the next major milestone.
    5. Include view trend chart data and high-level stats (Engagement Rate, CPM estimate, etc).`;
  } else if (type === AnalysisType.TREND_STRATEGY) {
    taskInstruction = `Trend & Viral Content Strategy. Analyze current and past month trends for the niche: "${input || instructions}". 
    Generate 5 long-form video ideas and 10 short-form (Shorts/Reels) ideas. 
    Provide specific hooks, titles, and SEO keywords for each idea.`;
  } else if (type === AnalysisType.RESUME) {
    taskInstruction = `Resume Strategy Audit. Match the provided Resume content against the Job Description: "${instructions}". 
    Identify missing tech keywords, quantify achievements, and recommend structural changes to maximize ATS compatibility.`;
  } else if (type === AnalysisType.PDF_REFINE) {
    taskInstruction = `Document Refinement. Modify the content based on: "${instructions}".`;
  } else {
    taskInstruction = "General Document Analysis. Summarize and score structure.";
  }

  const systemInstructions = `You are Content IQ, a world-class YouTube strategist and channel growth engineer. 
  Your goal is to analyze provided content and return a precise, high-impact audit in strict JSON format.
  
  STRICT FORMATTING & CONTENT RULES:
  1. All descriptive fields (summary, description, thumbnailReview) MUST be a list of bullet points starting with '-'.
  2. For YouTube audits, generate exactly 10 high-performance tags that target viral search intent.
  3. Ensure the 'title' is optimized for high impact (CTR) - use power words and psychological triggers.
  4. Tone: Professional, analytical, and visionary. Use terms like "high-velocity node," "engagement depth," and "content algorithm alignment."
  5. RETURN ONLY VALID JSON. NO MARKDOWN, NO EXPLANATIONS.
  
  JSON SCHEMA:
  {
    "title": "Optimized Title",
    "summary": "- Point 1\\n- Point 2",
    "description": "- Point 1\\n- Point 2",
    "thumbnailReview": "- Point 1\\n- Point 2",
    "tags": ["tag1", "tag2", ...],
    "scores": { "clarity": 85, "engagement": 90, "originality": 75, "structure": 80, "overall": 82 },
    "improvements": ["- Action 1", "- Action 2"],
    "tips": { "thumbnails": "...", "titles": "...", "content": "...", "strategy": "..." },
    "stats": [{ "label": "Retention", "value": "65%", "trend": "up" }, ...],
    "chartData": [{ "name": "Week 1", "value": 100 }, ...],
    "channelVideos": [{ "id": "vid1", "title": "Vid Title", "thumbnail": "url", "views": "1M", "publishedAt": "1d ago" }, ...],
    "channelMetadata": { "bannerUrl": "url", "avatarUrl": "url", "subscriberCount": "1M", "videoCount": "100", "handle": "@handle", "description": "..." }
  }`;

  const isFile = typeof input !== 'string';
  let prompt = "";
  if (isFile) {
    prompt = `I am providing data for a document audit. File type: ${input.mimeType}. Content Data: ${input.data.substring(0, 5000)}... (truncated if large). 
    Perform the following audit: ${taskInstruction}. 
    Follow these instructions: ${systemInstructions}`;
  } else {
    prompt = `Analyze: ${input}. Instructions: ${taskInstruction}. 
    Follow these instructions: ${systemInstructions}`;
  }

  try {
    const p = getPuter();
    const chatResponse = await p.ai.chat(prompt);
    
    if (!chatResponse) {
      throw new Error("EMPTY_RESPONSE: Puter AI returned no data.");
    }

    const text = typeof chatResponse === 'string' 
      ? chatResponse 
      : (chatResponse as any).message?.content || (chatResponse as any).content || JSON.stringify(chatResponse);
    
    // Attempt to extract JSON if there's preamble
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : text.replace(/```json\n?|```/g, "").trim();
    
    try {
      const result = JSON.parse(jsonString);
      
      if (type === AnalysisType.YOUTUBE && typeof input === 'string') {
        const videoId = extractYoutubeId(input);
        if (videoId) result.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }

      return result;
    } catch (parseError) {
      console.error("JSON Parse Error. Raw Text:", text);
      throw new Error(`DATA_CORRUPTION: Failed to parse AI response as JSON. Ref: ${text.substring(0, 50)}...`);
    }
  } catch (e: any) {
    console.error("Puter AI Execution Error:", e);
    const message = e.message || "Unknown error";
    if (message.includes("fetch") || message.includes("NetworkError")) {
      throw new Error("NETWORK_LINK_REFUSED: Puter AI could not be reached. Check your connection or browser privacy settings.");
    }
    throw new Error(`NEURAL_LINK_FAILURE: ${message}`);
  }
};



import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisType, AnalysisResult } from "../types";

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
  // Use the recommended Gemini model for complex tasks or fall back to flash
  const modelName = (type === AnalysisType.IMAGE_GEN) ? 'gemini-2.5-flash-image' : 'gemini-3-flash-preview';
  
  // Use both possible environment variable names to ensure cross-platform compatibility
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API KEY MISSING: Please ensure GEMINI_API_KEY is configured in your environment or settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // REAL IMAGE GENERATION
  if (type === AnalysisType.IMAGE_GEN) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [{ text: `Create a professional, high-impact YouTube thumbnail art or digital illustration for: ${input}. Style: Cinematic, vibrant, high detail.` }] 
      },
      config: { 
        imageConfig: { aspectRatio: "16:9" } 
      }
    });
    
    let imageUrl = "";
    // Iterating through parts to find image data as recommended
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    if (!imageUrl) throw new Error("Neural Imaging Link Failed: No visual data returned.");

    return {
      summary: "- Neural art generation finalized.\n- Visual assets synchronized to local buffer.\n- Ready for platform export.",
      generatedImageUrl: imageUrl,
      scores: { clarity: 100, engagement: 100, originality: 100, structure: 100, overall: 100 },
      improvements: ["- Use stylistic modifiers like '8k' or 'hyper-realistic' for more refined iterations."],
      tips: { content: "Precise prompts yield superior visual coherence in the neural matrix." }
    };
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
    4. identify good/bad practices and a roadmap to hit the next major milestone.
    5. Include view trend chart data and high-level stats (Engagement Rate, CPM estimate, etc).`;
  } else if (type === AnalysisType.TREND_STRATEGY) {
    taskInstruction = `Trend & Viral Content Strategy. Analyze current and past month trends for the niche: "${input || instructions}". 
    Generate 5 long-form video ideas and 10 short-form (Shorts/Reels) ideas. 
    Provide specific hooks, titles, and SEO keywords for each idea.`;
  } else if (type === AnalysisType.RESUME) {
    taskInstruction = `Resume Strategy Audit. Match the provided Resume PDF against the Job Description: "${instructions}". 
    Identify missing tech keywords, quantify achievements, and recommend structural changes to maximize ATS compatibility.`;
  } else if (type === AnalysisType.PDF_REFINE) {
    taskInstruction = `Document Refinement. Modify the content based on: "${instructions}".`;
  } else {
    taskInstruction = "General Document Analysis. Summarize and score structure.";
  }

  const systemInstructions = `You are Content IQ, a world-class YouTube strategist and channel growth engineer. 
  Your goal is to analyze provided content and return a precise, high-impact audit.
  
  STRICT FORMATTING & CONTENT RULES:
  1. All descriptive fields (summary, description, thumbnailReview) MUST be a list of bullet points starting with '-'.
  2. For YouTube audits, generate exactly 10 high-performance tags that target viral search intent.
  3. Ensure the 'title' is optimized for high impact (CTR) - use power words and psychological triggers.
  4. For CHANNEL DEEP DIVES: 
     - Use the googleSearch tool to find REAL metadata for the provided handle (banner, avatar, sub count).
     - Populate 'channelVideos' with the actual titles and thumbnails of the latest 8 videos from that channel.
     - If real data is unavailable, generate EXTREMELY RELEVANT and realistic placeholders that match the creator's known niche.
  5. For Trend audits, ALWAYS include specific 'stats' (4 items with trend markers) and 'chartData' (6 items for a month-over-month trend visualization).
  6. Tone: Professional, analytical, and visionary. Use terms like "high-velocity node," "engagement depth," and "content algorithm alignment."
  
  CURRENT TASK: ${taskInstruction}`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Highly optimized title or Document Subject" },
      summary: { type: Type.STRING, description: "Bullet point analysis or Resume/JD gap analysis" },
      description: { type: Type.STRING, description: "Bullet point descriptive metadata" },
      thumbnailReview: { type: Type.STRING, description: "Bullet point visual audit (N/A for docs)" },
      tags: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "10 relevant tags or keywords"
      },
      scores: {
        type: Type.OBJECT,
        properties: {
          clarity: { type: Type.NUMBER },
          engagement: { type: Type.NUMBER },
          originality: { type: Type.NUMBER },
          structure: { type: Type.NUMBER },
          overall: { type: Type.NUMBER }
        },
        required: ["clarity", "engagement", "originality", "structure", "overall"]
      },
      improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of actionable improvement points" },
      tips: {
        type: Type.OBJECT,
        properties: {
          thumbnails: { type: Type.STRING },
          titles: { type: Type.STRING },
          content: { type: Type.STRING },
          strategy: { type: Type.STRING }
        }
      },
      stats: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
            value: { type: Type.STRING },
            trend: { type: Type.STRING, enum: ["up", "down", "neutral"] }
          }
        }
      },
      chartData: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Timeline point or category" },
            value: { type: Type.NUMBER, description: "Primary metric value" },
            secondaryValue: { type: Type.NUMBER, description: "Secondary metric value (optional)" }
          }
        }
      },
      channelVideos: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            thumbnail: { type: Type.STRING },
            views: { type: Type.STRING },
            publishedAt: { type: Type.STRING },
            duration: { type: Type.STRING }
          },
          required: ["id", "title", "thumbnail", "views"]
        }
      },
      channelMetadata: {
        type: Type.OBJECT,
        properties: {
          bannerUrl: { type: Type.STRING },
          avatarUrl: { type: Type.STRING },
          subscriberCount: { type: Type.STRING },
          videoCount: { type: Type.STRING },
          handle: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    },
    required: ["summary", "scores", "improvements", "tips"]
  };

  const isFile = typeof input !== 'string';
  const contents = isFile 
    ? { parts: [{ inlineData: input }, { text: `Perform the following audit: ${taskInstruction}` }] }
    : `Analyze: ${input}. Instructions: ${taskInstruction}`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: modelName,
    contents: contents,
    config: {
      systemInstruction: systemInstructions,
      responseMimeType: "application/json",
      responseSchema: schema,
      // Mandatory: googleSearch tool usage for YouTube, Competitor, Channel and Trend audits
      tools: (type === AnalysisType.YOUTUBE || type === AnalysisType.COMPETITIVE_AUDIT || type === AnalysisType.CHANNEL_DEEP_DIVE || type === AnalysisType.TREND_STRATEGY) ? [{ googleSearch: {} }] : []
    }
  });

  try {
    const result = JSON.parse(response.text);
    
    if (type === AnalysisType.YOUTUBE && typeof input === 'string') {
      const videoId = extractYoutubeId(input);
      if (videoId) result.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    // Mandatory: Extracting URLs from groundingChunks when Google Search is used
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      result.sources = response.candidates[0].groundingMetadata.groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({ 
          title: chunk.web.title || 'Source', 
          uri: chunk.web.uri 
        }));
    }

    return result;
  } catch (e) {
    console.error("Gemini Parse Error:", e);
    throw new Error("Neural Link Data Corruption: The AI returned an invalid packet.");
  }
};

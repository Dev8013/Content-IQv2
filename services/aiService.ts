
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
  // Always initialize with process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  } else if (type === AnalysisType.RESUME) {
    taskInstruction = `Resume Strategy Audit. Match the provided Resume PDF against the Job Description: "${instructions}". 
    Identify missing tech keywords, quantify achievements, and recommend structural changes to maximize ATS compatibility.`;
  } else if (type === AnalysisType.PDF_REFINE) {
    taskInstruction = `Document Refinement. Modify the content based on: "${instructions}".`;
  } else {
    taskInstruction = "General Document Analysis. Summarize and score structure.";
  }

  const systemInstructions = `You are Content IQ, a world-class strategist and neural analyzer. 
  Your goal is to analyze provided content and return a deep audit.
  
  STRICT FORMATTING RULES:
  1. All descriptive fields (summary, description, thumbnailReview) MUST be a list of bullet points starting with '-'.
  2. For YouTube audits, generate exactly 10 high-performance tags.
  3. Ensure the 'title' is optimized for high impact/CTR.
  4. For Resume audits, 'summary' must provide a direct comparison and recommendations in bullet points.
  
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
          content: { type: Type.STRING }
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
    // Upgraded to gemini-3-pro-preview for advanced reasoning tasks as per guidelines
    model: "gemini-3-pro-preview",
    contents: contents,
    config: {
      systemInstruction: systemInstructions,
      responseMimeType: "application/json",
      responseSchema: schema,
      // Mandatory: googleSearch tool usage for YouTube audits
      tools: type === AnalysisType.YOUTUBE ? [{ googleSearch: {} }] : []
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

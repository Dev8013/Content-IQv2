
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
  // Always use process.env.API_KEY directly for initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Handle Image Generation separately using the recommended default model
  if (type === AnalysisType.IMAGE_GEN) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: input as string }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    
    let imageUrl = "";
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    return {
      summary: "Image generation successful based on neural prompt.",
      generatedImageUrl: imageUrl,
      scores: { clarity: 100, engagement: 100, originality: 100, structure: 100, overall: 100 },
      improvements: [],
      tips: { content: "Refine prompts with lighting and style keywords for better results." }
    };
  }
  
  const systemInstructions = {
    [AnalysisType.YOUTUBE]: "You are a world-class YouTube strategist and SEO expert. Extract title, description, and tags. Provide quality scores (0-100), summary, and actionable advice.",
    [AnalysisType.PDF]: "Summarize the provided document and score its structural and logical integrity.",
    [AnalysisType.RESUME]: "Score this resume against industry standards and ATS compatibility.",
    [AnalysisType.PDF_REFINE]: `You are an expert editor. Rewrite or modify the provided document content based on these instructions: "${instructions}". Return the full modified text in the 'summary' field.`
  };

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      summary: { type: Type.STRING },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } },
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
      improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
      tips: {
        type: Type.OBJECT,
        properties: {
          thumbnails: { type: Type.STRING },
          titles: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: { type: Type.STRING },
          content: { type: Type.STRING },
          formatting: { type: Type.STRING }
        }
      }
    },
    required: ["summary", "scores", "improvements", "tips"]
  };

  const isFile = typeof input !== 'string';
  const contents: any = isFile 
    ? { parts: [{ inlineData: input }, { text: instructions || "Analyze this content." }] }
    : `Analyze: ${input}. ${instructions}`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    // Using gemini-3-flash-preview for general text tasks as per model selection guidelines
    model: "gemini-3-flash-preview",
    contents: contents,
    config: {
      systemInstruction: systemInstructions[type] || systemInstructions[AnalysisType.PDF],
      responseMimeType: "application/json",
      responseSchema: schema,
      // Google Search grounding for relevant content analysis
      tools: type === AnalysisType.YOUTUBE ? [{ googleSearch: {} }] : []
    }
  });

  try {
    const result = JSON.parse(response.text);
    
    if (type === AnalysisType.YOUTUBE && typeof input === 'string') {
      const videoId = extractYoutubeId(input);
      if (videoId) result.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      result.sources = response.candidates[0].groundingMetadata.groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({ title: chunk.web.title, uri: chunk.web.uri }));
    }
    return result;
  } catch (e) {
    throw new Error("Neural link failed: Data corruption in AI response.");
  }
};

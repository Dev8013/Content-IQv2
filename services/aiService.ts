
import { AnalysisType, AnalysisResult } from "../types";

declare const puter: any;

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
  
  if (type === AnalysisType.IMAGE_GEN) {
    const prompt = `Act as an AI image generator. Describe in extreme detail a high-quality thumbnail image for: ${input}. Your response should be a JSON object matching this schema: { "summary": "Detailed description of the image", "scores": {"clarity": 100, "engagement": 100, "originality": 100, "structure": 100, "overall": 100}, "improvements": [], "tips": {"content": "Use neon lighting"} }`;
    const response = await puter.ai.chat(prompt);
    const result = JSON.parse(response.toString().replace(/```json|```/g, ''));
    result.generatedImageUrl = `https://picsum.photos/seed/${encodeURIComponent(input as string)}/1280/720?grayscale`;
    return result;
  }

  const youtubeSpecific = type === AnalysisType.YOUTUBE ? `
    Additionally, for this YouTube Audit:
    1. Critically analyze the likely visual impact of the thumbnail (based on typical trends for this video topic).
    2. Provide a 'thumbnailReview' field (150 words) specifically critiquing composition, color theory, and Click-Through Rate (CTR) potential.
    3. Generate a likely high-SEO 'description' and a list of 10 relevant 'tags'.
  ` : '';

  const systemPrompt = `You are Content IQ, a world-class strategist and neural analyzer. 
  Analyze the provided content. 
  Type: ${type}. Instructions: ${instructions}. 
  ${youtubeSpecific}
  Return ONLY a valid JSON object with this exact structure:
  {
    "title": "A high-performing title",
    "summary": "Comprehensive deep analysis/synopsis",
    "description": "Optimized metadata description",
    "thumbnailReview": "Visual audit of the thumbnail effectiveness",
    "tags": ["tag1", "tag2", "..."],
    "scores": {"clarity": 85, "engagement": 90, "originality": 70, "structure": 80, "overall": 82},
    "improvements": ["Advise 1", "Advise 2"],
    "tips": {"thumbnails": "...", "titles": "...", "content": "..."}
  }`;

  const userInput = typeof input === 'string' ? input : `[File Data Received: ${input.mimeType}]`;
  
  const response = await puter.ai.chat(`${systemPrompt}\n\nContent to analyze: ${userInput}`);
  const cleanJson = response.toString().replace(/```json|```/g, '').trim();
  
  try {
    const result = JSON.parse(cleanJson);
    if (type === AnalysisType.YOUTUBE && typeof input === 'string') {
      const videoId = extractYoutubeId(input);
      if (videoId) result.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return result;
  } catch (e) {
    console.error("Failed to parse Puter AI response:", cleanJson);
    throw new Error("Neural Link Data Corruption: The AI returned an invalid packet.");
  }
};

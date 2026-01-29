
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
    const prompt = `Act as an AI image generator. Describe in extreme detail a high-quality thumbnail image for: ${input}. Your response should be a JSON object matching this schema: { "summary": "- Point 1\n- Point 2", "scores": {"clarity": 100, "engagement": 100, "originality": 100, "structure": 100, "overall": 100}, "improvements": ["- Advise 1"], "tips": {"content": "Use neon lighting"} }`;
    const response = await puter.ai.chat(prompt);
    const result = JSON.parse(response.toString().replace(/```json|```/g, ''));
    result.generatedImageUrl = `https://picsum.photos/seed/${encodeURIComponent(input as string)}/1280/720?grayscale`;
    return result;
  }

  const youtubeSpecific = type === AnalysisType.YOUTUBE ? `
    Additionally, for this YouTube Audit:
    1. Critically analyze the likely visual impact of the thumbnail associated with this topic/URL.
    2. Provide a 'thumbnailReview' field formatted as a list of bullet points critiquing composition, color theory, and CTR potential.
    3. Generate a high-SEO 'description' (summary format) and a list of at least 10 relevant 'tags'.
  ` : '';

  const systemPrompt = `You are Content IQ, a world-class strategist and neural analyzer. 
  Analyze the provided content. 
  Type: ${type}. Instructions: ${instructions}. 
  ${youtubeSpecific}
  
  IMPORTANT: All descriptive fields (summary, thumbnailReview, description) MUST be returned as a list of concise bullet points (using '-' prefix) rather than paragraphs.
  
  Return ONLY a valid JSON object with this exact structure:
  {
    "title": "A high-performing title",
    "summary": "- Point 1\n- Point 2\n- Point 3",
    "description": "- Optimized Point 1\n- Optimized Point 2",
    "thumbnailReview": "- Visual Point 1\n- Visual Point 2",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
    "scores": {"clarity": 85, "engagement": 90, "originality": 70, "structure": 80, "overall": 82},
    "improvements": ["- Strategy 1", "- Strategy 2"],
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

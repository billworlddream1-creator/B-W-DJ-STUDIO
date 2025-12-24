
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Track, AISuggestion, AIComposition } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTransitionSuggestion = async (
  trackA: Track,
  trackB: Track
): Promise<AISuggestion> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `DJ Assistant: Suggest transition between ${trackA.title} and ${trackB.title}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transitionMethod: { type: Type.STRING },
            description: { type: Type.STRING },
            timingHint: { type: Type.STRING },
          },
          required: ["transitionMethod", "description", "timingHint"],
        },
      },
    });
    return JSON.parse(response.text) as AISuggestion;
  } catch (error) {
    return { transitionMethod: "Crossfade", description: "Smooth fade.", timingHint: "End of bar" };
  }
};

export const generateAIComposition = async (vibe: string): Promise<AIComposition> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a music composition for a DJ based on the vibe: "${vibe}". 
    Return a sequence for 8 steps of drums (kick, snare, hihat, clap) and 8 steps of synth frequencies (C4=261.63, etc).
    Also write a short "DJ drop" vocal script.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          drums: { type: Type.ARRAY, items: { type: Type.STRING } },
          melody: { type: Type.ARRAY, items: { type: Type.NUMBER } },
          vocalScript: { type: Type.STRING }
        },
        required: ["drums", "melody", "vocalScript"]
      }
    }
  });
  return JSON.parse(response.text) as AIComposition;
};

export const generateVocalDrop = async (script: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say with a cool DJ voice: ${script}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

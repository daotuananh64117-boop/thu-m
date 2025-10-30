
import { GoogleGenAI, Modality } from "@google/genai";

export const generateSpeech = async (text: string, voice: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not set in environment variables.");
    }
    
    if (!text.trim()) {
        throw new Error("Script text cannot be empty.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say with a clear and professional tone: ${text}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voice },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
        throw new Error("Failed to generate audio. The response did not contain audio data.");
    }

    return base64Audio;
};

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FeedItem } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize immediately, but handle errors gracefully if key is missing during call
const ai = new GoogleGenAI({ apiKey });

const feedItemSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headline: {
      type: Type.STRING,
      description: "A short, catchy hook title (under 10 words).",
    },
    type: {
      type: Type.STRING,
      enum: ["quiz", "fact", "analogy"],
      description: "The type of educational content.",
    },
    content: {
      type: Type.STRING,
      description: "The main educational body text. Keep it punchy (under 40 words).",
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "If type is quiz, provide 3-4 options. Otherwise empty.",
    },
    correctAnswer: {
      type: Type.STRING,
      description: "If type is quiz, the correct option string.",
    },
    explanation: {
      type: Type.STRING,
      description: "A very brief explanation of why the answer is correct or the fact matters (under 20 words).",
    },
  },
  required: ["headline", "type", "content", "explanation"],
};

export const generateFutureFeedContent = async (goalStatement: string, count: number = 3): Promise<FeedItem[]> => {
  if (!apiKey) {
    console.error("API Key is missing");
    // Return fallback content if no API key is set to prevent app crash
    return [
      {
        id: 'fallback-1',
        type: 'fact',
        headline: 'API Key Missing',
        content: 'Please provide a valid Gemini API Key to generate real content.',
        explanation: 'The app needs the API key to function.'
      }
    ];
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      The user has a goal: "${goalStatement}".
      Generate ${count} distinct, bite-sized educational feed items that help them achieve this goal.
      The tone should be "Social Media Style" - fast, engaging, and high-value.
      Mix up the types: Quiz, Interesting Fact, or a powerful Analogy.
      Make it feel like a TikTok caption or a Twitter thread hook.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: feedItemSchema,
        },
        systemInstruction: "You are a 'Future Self' assistant. Your job is to interrupt doom-scrolling with high-value micro-learning related to the user's specific goals.",
      },
    });

    const rawText = response.text;
    if (!rawText) throw new Error("No response from Gemini");

    const parsed = JSON.parse(rawText) as Omit<FeedItem, 'id'>[];

    return parsed.map((item, index) => ({
      ...item,
      id: `gen-${Date.now()}-${index}`,
    }));

  } catch (error) {
    console.error("Error generating feed:", error);
    return [
      {
        id: 'err-1',
        type: 'fact',
        headline: 'Connection Error',
        content: 'Could not reach the Future Self server. Try again.',
        explanation: 'Check your internet or API limits.'
      }
    ];
  }
};

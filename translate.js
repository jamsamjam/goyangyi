import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export async function geminiTranslation(message) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
        You are a friendly and patient Korean tutor helping people learn Korean.

        Please output your response **strictly** in the following JSON format:

        {
        "translation": "<translated text>",
        "keywords": [
            {"word": "<keyword>", "meaning": "<meaning or note>"},
            ...
        ],
        "grammar_points": [
            {"title": "<grammar point>", "explanation": "<short explanation — one concise sentence only>"},
            ...
        ],
        "extra_message": "<encouraging or friendly closing remark>"
        }

        Message to translate:
        ${message}
        `,
  });
  return response.text;
}

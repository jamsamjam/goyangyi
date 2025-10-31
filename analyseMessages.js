import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function isWeatherColdMessage(message) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
        You are a classifier analyzing the intent of a Discord message.
        Your task is to determine if the user's message is about **'feeling cold due to low weather or temperature'**.

        ## Rules:
        1.  Coldness due to weather/temperature (e.g., "it's cold," "my hands are freezing," "it's chilly") is true.
        2.  Chills due to illness (e.g., "I have a cold," "I have the flu," "body aches") are false.
        3.  Metaphorical or emotional expressions (e.g., "cold atmosphere," "chills down my spine," "a cold person") are false.
        4.  Any content completely unrelated to being cold is false.
        5.  You must respond with only true or false.

        ## Examples:
        * "Ugh, it's freezing" -> true
        * "Why is the weather so cold today?" -> true
        * "My hands and feet are frozen" -> true
        * "It's so chilly" -> true
        * "I think I caught a cold" -> false
        * "I have a fever and chills" -> false (This is illness)
        * "The vibe in here is so cold" -> false
        * "I'm hungry" -> false
        * "Hello" -> false

        ## Message to Analyze:
        ${message}
        `,
    });
    return response.text;
}

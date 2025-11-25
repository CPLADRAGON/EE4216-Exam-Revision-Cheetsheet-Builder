import { GoogleGenAI } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_PROMPT = `
You are a strict Teaching Assistant for the course "EE4216 Hardware for IoT". 
The final exam format includes:
1. Spot and correct errors (Syntax, Logic, API misuse).
2. Fill in the blanks (API names, parameters, types).
3. Conceptual explanations.

Key Topics: ESP32-S3, GPIO, Interrupts, FreeRTOS (Tasks, Queues, Semaphores), WiFi, HTTP, MQTT, Deep Sleep, SPI, I2C.

Generate 3 unique exam-style questions based on these topics.
Return ONLY valid JSON array. No markdown formatting.
Structure:
[
  {
    "id": number,
    "type": "error_spotting" | "fill_blank" | "concept",
    "question": "The question text",
    "codeContext": "Optional C++ code snippet if needed",
    "answer": "The correct answer",
    "explanation": "Why this is the answer"
  }
]
`;

export const generateQuestions = async (): Promise<Question[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate 3 hard exam questions for EE4216. One error spotting (e.g. wrong FreeRTOS API or ISR blocking), one fill in the blank (e.g. MQTT or HTTP API), one concept (e.g. Deep Sleep vs Light Sleep).",
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json"
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Question[];
    }
    return [];
  } catch (error) {
    console.error("Failed to generate questions", error);
    return [
        {
            id: 1,
            type: "error_spotting",
            question: "Find the error in the following ISR code.",
            codeContext: "void IRAM_ATTR onTimer() {\n  Serial.println(\"Interrupt triggered\");\n}",
            answer: "Serial.println() inside ISR",
            explanation: "ISRs must be short and fast. Serial printing depends on interrupts which are often disabled inside an ISR, and it is too slow, potentially causing a crash."
        }
    ];
  }
};
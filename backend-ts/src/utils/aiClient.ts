import { genAI } from '../config/gemini';

export async function generateAIResponse(systemPrompt: string, userQuery: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const fullPrompt = `${systemPrompt}\n\nUser: ${userQuery}`;

  const result = await model.generateContent(fullPrompt);
  return result.response.text();
}

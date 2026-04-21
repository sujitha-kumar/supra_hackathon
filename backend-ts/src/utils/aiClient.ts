import { genAI } from '../config/gemini';
import { env } from '../config/env';

const fallbackModels = [
  env.GEMINI_MODEL,
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-002',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

let activeModelName: string | null = null;

function isUnavailableModelError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return /model.+not found|not supported for generateContent|404/i.test(error.message);
}

export async function generateAIResponse(systemPrompt: string, userQuery: string): Promise<string> {
  const modelNames = activeModelName
    ? [activeModelName, ...fallbackModels.filter((modelName) => modelName !== activeModelName)]
    : fallbackModels;

  const fullPrompt = `${systemPrompt}\n\nUser: ${userQuery}`;

  let lastError: unknown;

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(fullPrompt);
      activeModelName = modelName;

      return result.response.text();
    } catch (error) {
      lastError = error;

      if (!isUnavailableModelError(error)) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('No supported Gemini model available');
}

import { getEnv } from '../config/env';
import OpenAI from 'openai';

type AIRequest = {
  prompt: string;
  language: string;
};

type AIResponse = {
  text: string;
  source: 'local' | 'openai';
};

const localRules = [
  { pattern: /hello|hi|hey/i, responses: { en: 'Hello! How can I help today?', es: '¡Hola! ¿En qué puedo ayudar?', fr: 'Bonjour! Comment puis-je aider?' } },
  { pattern: /weather/i, responses: { en: 'The local forecast looks clear.', es: 'El pronóstico local parece despejado.', fr: 'La météo locale semble dégagée.' } },
  { pattern: /help|ayuda|aide/i, responses: { en: 'Try asking about analytics or files.', es: 'Prueba preguntar sobre analíticas o archivos.', fr: 'Essayez de demander des analyses ou des fichiers.' } }
];

export async function generateAIResponse(req: AIRequest): Promise<AIResponse> {
  const env = getEnv();
  const language = ['en', 'es', 'fr'].includes(req.language) ? req.language : 'en';

  if (!env.OPENAI_API_KEY || env.USE_CLOUD !== 'true') {
    for (const rule of localRules) {
      if (rule.pattern.test(req.prompt)) {
        const resp = (rule.responses as any)[language] || rule.responses.en;
        return { text: resp, source: 'local' };
      }
    }
    return { text: language === 'es' ? 'No estoy seguro, pero sigo aprendiendo localmente.' : language === 'fr' ? "Je ne suis pas sûr, mais j'apprends localement." : "I'm not sure, but I'm learning locally.", source: 'local' };
  }

  try {
    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are GlobalSmart Hub assistant. Respond briefly and support multiple languages.' },
        { role: 'user', content: req.prompt }
      ]
    });
    const text = completion.choices[0]?.message?.content || '...';
    return { text, source: 'openai' };
  } catch {
    // Fallback to local on error
    for (const rule of localRules) {
      if (rule.pattern.test(req.prompt)) {
        const resp = (rule.responses as any)[language] || rule.responses.en;
        return { text: resp, source: 'local' };
      }
    }
    return { text: "I'm not sure, but I'm learning locally.", source: 'local' };
  }
}

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// ─── Gemini 2.5 Flash via OpenAI-Compatible SDK ───────────────────────────────
// The OpenAI SDK is completely vendor-agnostic.
// Pointing baseURL at Google's OpenAI-compatible endpoint proves full
// infrastructure decoupling — swap one URL to change AI providers.

const aiClient = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

export default aiClient;

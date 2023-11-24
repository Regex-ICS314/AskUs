import OpenAI from 'openai';

// Initialize and export OpenAI client instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;

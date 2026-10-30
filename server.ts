import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

app.post('/api/chat', async (req, res) => {
  const prompt = String(req.body?.prompt || '').trim();

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt richiesto' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'Manca GEMINI_API_KEY. Aggiungila nel file .env',
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const text = typeof response?.text === 'string' ? response.text : 'Nessuna risposta disponibile.';
    return res.json({ text });
  } catch (error) {
    console.error('Gemini error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Errore generico Gemini',
    });
  }
});

app.listen(port, () => {
  console.log(`AI server listening on http://localhost:${port}`);
});

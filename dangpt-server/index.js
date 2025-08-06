require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

app.use(cors());
app.use(express.json());

// Middleware: simple token-based auth
app.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (token !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const response = await axios.post(`http://localhost:11434/api/generate`, {
      model: OLLAMA_MODEL,
      prompt: message,
      stream: false,
    });

    res.json({ response: response.data.response.trim() });
  } catch (err) {
    console.error('Ollama error:', err.message);
    res.status(500).json({ error: 'Ollama request failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🔙 Server running on http://localhost:${PORT}`);
});
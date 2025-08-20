require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

const readline = require('readline');

app.use(cors());
app.use(express.json());

//simple token-based auth to make sure were connected to client
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
    const ollamaResponse = await axios({
      method: 'post',
      url: 'http://localhost:11434/api/generate',
      data: {
        model: OLLAMA_MODEL,
        prompt: message,
        stream: true,
      },
      responseType: 'stream',
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    //use readline instead to write each line from Ollama
    const rl = readline.createInterface({
      input: ollamaResponse.data,
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      try {
        const data = JSON.parse(line);
        if (data.response) {
          res.write(data.response);
        }
      } catch (e) {
      }
    });

    rl.on('close', () => {
      res.end();
    });

    ollamaResponse.data.on('error', (err) => {
      console.error('Ollama stream error:', err.message);
      res.end();
    });
  } catch (err) {
    console.error('Ollama error:', err.message);
    res.status(500).json({ error: 'Ollama request failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
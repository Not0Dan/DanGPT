import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN;

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/chat`, {
        message: input
      }, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`
        }
      });

      setResponse(res.data.response);
    } catch (err) {
      setResponse('Error: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Ollama Chatbot</h1>
      <textarea rows="4" value={input} onChange={(e) => setInput(e.target.value)} />
      <br />
      <button onClick={sendMessage}>Send</button>
      <pre>{response}</pre>
    </div>
  );
}

export default App;
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN;

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // adjust text rea height to fit how many lines of text rather than character count
  const adjustTextAreaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // reset height
      textarea.style.height = textarea.scrollHeight + 'px'; // set to scrollHeight
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    adjustTextAreaHeight();
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((msgs) => [...msgs, { role: 'user', text: input }]);

    try {
      const res = await axios.post(
        `${API_URL}/api/chat`,
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );

      setMessages((msgs) => [...msgs, { role: 'bot', text: res.data.response }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { role: 'bot', text: 'Error: ' + err.message }]);
    }

    setInput('');
    // reset textarea height after clearing input **** takes a while because of the message response
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    scrollToBottom();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    adjustTextAreaHeight();
  }, []);

  return ( 
    /*
    all really messy
    need to clean up styles and structure

    or make this a react native app
    will look into structure of react apps
    */
    <div
      style={{
        maxWidth: 1000,
        margin: '20px auto',
        padding: '20px 50px',
        border: '1px solid #333',
        borderRadius: 8,
        backgroundColor: '#222',
        display: 'flex',
        flexDirection: 'column',
        height: '90vh',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 20, color: '#fff' }}>
        DanGPT
      </h1>

      <div
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '10px 50px',
          border: '1px solid #333',
          borderRadius: 6,
          marginBottom: 10,
          backgroundColor: '#222',
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center' }}>
            Start the conversation!
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                backgroundColor: msg.role === 'user' ? '#007bff' : '#e5e5ea',
                color: msg.role === 'user' ? '#fff' : '#000',
                padding: '10px 15px',
                borderRadius: 20,
                whiteSpace: 'pre-wrap',
                fontSize: 15,
                lineHeight: 1.4,
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        style={{
          resize: 'none',
          padding: '10px 50px',
          fontSize: 16,
          borderRadius: 6,
          border: '1px solid #333',
          backgroundColor: '#222',
          color: '#fff',
          fontFamily: 'inherit',
          overflow: 'hidden',
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          padding: '10px 20px',
          fontSize: 16,
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          alignSelf: 'flex-end',
        }}
      >
        Send
      </button>
    </div>
  );
}

export default App;
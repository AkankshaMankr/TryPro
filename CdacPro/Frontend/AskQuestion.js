import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function AskQuestion() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/questions/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
        },
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!question.trim()) return;

    try {
      await axios.post(
        'http://localhost:5050/questions/ask',
        { userId, question },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
          },
        }
      );
      setQuestion('');
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{
        maxWidth: '40%',
        height: '90vh',
        margin: 'auto',
        paddingTop: '30px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          backgroundColor: '#1e1e1e', // outer dark background
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#2d2d2d',
            color: '#ffffff',
            padding: '12px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            borderBottom: '1px solid #444',
          }}
        >
          Ask Your Questions
        </div>

        {/* Chat Body */}
        <div
          style={{
            flexGrow: 1,
            padding: '16px',
            overflowY: 'auto',
            backgroundColor: '#2a2a2a',
          }}
        >
          {messages.map((msg) => (
            <div key={msg.id}>
              {/* User Message */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <div
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '10px',
                    maxWidth: '75%',
                    fontSize: '14px',
                  }}
                >
                  <small><strong>You:</strong></small>
                  <div>{msg.question}</div>
                </div>
              </div>

              {/* Admin Answer */}
              {msg.isAnswered && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
                  <div
                    style={{
                      backgroundColor: '#f5f5f5',
                      color: '#000',
                      padding: '10px',
                      borderRadius: '10px',
                      maxWidth: '75%',
                      fontSize: '14px',
                      border: '1px solid #ccc',
                    }}
                  >
                    <small><strong>Admin:</strong></small>
                    <div>{msg.answer}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Box */}
        <div
          style={{
            display: 'flex',
            padding: '12px',
            borderTop: '1px solid #444',
            backgroundColor: '#1e1e1e',
          }}
        >
          <input
            type="text"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #888',
              marginRight: '8px',
              backgroundColor: '#f5f5f5',
              color: '#000',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '10px 16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default AskQuestion;

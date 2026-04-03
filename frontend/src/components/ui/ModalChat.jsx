import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, Copy, Check } from 'lucide-react';
import axios from 'axios';

const ModalChat = ({ contextNode, onApplySuggestion }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `I'm analyzing this Level ${contextNode.level} node. How can I help refine the ${contextNode.name || 'details'}?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastSuggestion, setLastSuggestion] = useState(null);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Endpoint for contextual AI assistance
      const res = await axios.post('/api/ai/assist-node', {
        prompt: input,
        context: contextNode
      });

      const aiResponse = res.data; // Expecting { message: string, suggestion: object }
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse.message }]);
      if (aiResponse.suggestion) {
        setLastSuggestion(aiResponse.suggestion);
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Core connection interrupted. I couldn't process that request." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="modal-chat-container">
      <div className="chat-header">
        <Bot size={16} className="text-primary" />
        <span>Architect Sidecar</span>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message-wrapper ${msg.role}`}>
            <div className="message-bubble">
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-wrapper assistant">
            <div className="message-bubble typing">...</div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* --- SUGGESTION POPUP --- */}
      {lastSuggestion && (
        <div className="suggestion-toast">
          <div className="suggestion-info">
            <Zap size={14} />
            <span>Architect drafted improvements</span>
          </div>
          <button onClick={() => {
            onApplySuggestion(lastSuggestion);
            setLastSuggestion(null);
          }}>
            Apply to Form
          </button>
        </div>
      )}

      <form className="chat-input-area" onSubmit={handleSendMessage}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for suggestions..."
        />
        <button type="submit" disabled={isTyping}>
          <Send size={16} />
        </button>
      </form>

      <style jsx>{`
        .modal-chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #0d1117;
        }

        .chat-header {
          padding: 15px;
          border-bottom: 1px solid #30363d;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #c9d1d9;
          text-transform: uppercase;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .message-wrapper { display: flex; width: 100%; }
        .message-wrapper.user { justify-content: flex-end; }
        
        .message-bubble {
          max-width: 85%;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .assistant .message-bubble {
          background: #161b22;
          color: #c9d1d9;
          border: 1px solid #30363d;
          border-bottom-left-radius: 2px;
        }

        .user .message-bubble {
          background: #238636;
          color: white;
          border-bottom-right-radius: 2px;
        }

        .suggestion-toast {
          margin: 10px;
          padding: 10px;
          background: rgba(56, 139, 253, 0.15);
          border: 1px solid rgba(56, 139, 253, 0.4);
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .suggestion-info { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: #58a6ff; }
        
        .suggestion-toast button {
          background: #58a6ff; color: white; border: none;
          padding: 4px 10px; border-radius: 4px; font-size: 0.7rem;
          font-weight: 600; cursor: pointer;
        }

        .chat-input-area {
          padding: 15px;
          border-top: 1px solid #30363d;
          display: flex;
          gap: 10px;
        }

        .chat-input-area input {
          flex: 1;
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 8px 12px;
          color: #c9d1d9;
          font-size: 0.85rem;
        }

        .chat-input-area button {
          background: none; border: none; color: #8b949e; cursor: pointer;
        }
        
        .chat-input-area button:hover:not(:disabled) { color: #58a6ff; }

        .typing { opacity: 0.5; font-style: italic; }
      `}</style>
    </div>
  );
};

export default ModalChat;
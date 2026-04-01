import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import aiService from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../common/Spinner';
import MarkdownRenderer from '../../common/MarkdownRenderer';

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setHistory(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, userMessage.content);

      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        timestamp: new Date(),
        relevantChunks: response.data.relevantChunks
      };

      setHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);

      const errorMessage = {
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        timestamp: new Date()
      };

      setHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      {/* UI rendering goes here */}
    </div>
  );
};

export default ChatInterface;
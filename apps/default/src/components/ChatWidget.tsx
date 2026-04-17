import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { musicApi } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const AGENT_ID = '01KAW691RVQCQRCKVCGAZ1CCPT';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessageRef = useRef<string>('');
  const currentMessageIdRef = useRef<string>('');

  useEffect(() => {
    if (isOpen && !conversationId) {
      initializeChat();
    }
  }, [isOpen]);

  const initializeChat = async () => {
    try {
      const convoId = await musicApi.createConversation(AGENT_ID);
      setConversationId(convoId);
      
      const eventSource = new EventSource(`/api/taskade/agents/${AGENT_ID}/public-conversations/${convoId}/stream`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsStreamReady(true);
      };

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'start') {
          currentMessageIdRef.current = data.messageId;
          currentMessageRef.current = '';
        } else if (data.type === 'text-delta') {
          currentMessageRef.current += data.delta;
          
          setMessages(prev => {
            const existing = prev.find(m => m.id === currentMessageIdRef.current);
            if (existing) {
              return prev.map(m =>
                m.id === currentMessageIdRef.current
                  ? { ...m, content: currentMessageRef.current }
                  : m
              );
            } else {
              return [...prev, {
                id: currentMessageIdRef.current,
                role: 'assistant',
                content: currentMessageRef.current,
              }];
            }
          });
        } else if (data.type === 'finish') {
          setIsLoading(false);
        }
      };

      eventSource.onerror = () => {
        setIsStreamReady(false);
      };
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !conversationId || !isStreamReady) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await musicApi.sendMessage(AGENT_ID, conversationId, input);
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white/5 dark:bg-black/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg shadow-black/40 flex flex-col overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <h3 className="font-semibold text-white">Primavibe Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-white/40 text-sm mt-8">
                  <p>👋 Ask me about music discovery,</p>
                  <p>playlist creation, or uploading tracks!</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] px-4 py-2 rounded-2xl',
                      message.role === 'user'
                        ? 'bg-cyan-500/20 text-white border border-cyan-500/30'
                        : 'bg-white/5 text-white/90 border border-white/10'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  disabled={!isStreamReady}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || !isStreamReady || isLoading}
                  className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/50 flex items-center justify-center z-50 hover:shadow-cyan-500/70 transition-shadow"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.button>
    </>
  );
};

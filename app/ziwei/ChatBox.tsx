import { formatMessage } from '@/utils/format';
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, ThumbsUp, ThumbsDown, ChevronDown } from 'lucide-react';
import styles from './ChatBox.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBoxProps {
  apiKey: string;
}

type ThinkingStatus = 'idle' | 'waiting' | 'thinking' | 'responding';

const ChatBox: React.FC<ChatBoxProps> = ({ apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [streamedContent, setStreamedContent] = useState('');
  const [thinkingStatus, setThinkingStatus] = useState<ThinkingStatus>('idle');
  const thinkingStatusRef = useRef<ThinkingStatus>('idle');
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    thinkingStatusRef.current = thinkingStatus;
  }, [thinkingStatus]);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: '你好！我是紫微助手，可以和你討論命盤以及解讀紫微斗數。有什麼我可以幫助你的嗎？',
        timestamp: new Date(),
      },
    ]);
  }, []);

  // 添加新的效果，專門處理串流消息的滾動
  useEffect(() => {
    if (thinkingStatus === 'responding' && streamedContent) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamedContent, thinkingStatus]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamedContent('');
    setThinkingStatus('waiting');

    try {
      if (!process.env.ZIWEI_CHAT_baseURL) {
        throw new Error('ZIWEI_CHAT_baseURL is not defined in the environment variables');
      }
      const response = await fetch(process.env.ZIWEI_CHAT_baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          inputs: {},
          query: input,
          response_mode: 'streaming',
          conversation_id: conversationId || '',
          user: 'ziwei-user'
        }),
      });

      if (!response.ok) throw new Error('API請求失敗');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('無法讀取響應');

      const decoder = new TextDecoder();
      let partialData = '';
      let messageId = '';
      let newConversationId = '';
      let accumulatedContent = '';
      let thinking = false;
      let partialThinkBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        partialData += chunk;
        const lines = partialData.split('\n\n');
        partialData = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));

              if (data.event === 'message') {
                if (!messageId) messageId = data.message_id;
                if (!newConversationId && data.conversation_id) {
                  newConversationId = data.conversation_id;
                  setConversationId(newConversationId);
                }

                let contentChunk = data.answer || '';

                if (!thinking && contentChunk.includes('<think>')) {
                  thinking = true;
                  setThinkingStatus('thinking');
                  partialThinkBuffer = contentChunk.substring(contentChunk.indexOf('<think>') + 7);
                  contentChunk = contentChunk.substring(0, contentChunk.indexOf('<think>'));
                }

                if (thinking) {
                  partialThinkBuffer += contentChunk;
                  if (partialThinkBuffer.includes('</think>')) {
                    thinking = false;
                    setThinkingStatus('responding');
                    contentChunk = partialThinkBuffer.substring(partialThinkBuffer.indexOf('</think>') + 8);
                    partialThinkBuffer = '';
                  } else {
                    continue;
                  }
                }

                if (thinkingStatusRef.current === 'waiting' && !partialThinkBuffer.includes('</think>')) {
                  setThinkingStatus('responding');
                }

                if (contentChunk.trim()) {
                  accumulatedContent += contentChunk;
                  const formattedContent = formatMessage(accumulatedContent);
                  setStreamedContent(formattedContent);
                  setCurrentAssistantMessage(formattedContent);
                }
              } else if (data.event === 'message_end') {
                setThinkingStatus('idle');
                const finalMessage: Message = {
                  id: messageId || Date.now().toString(),
                  role: 'assistant',
                  content: formatMessage(accumulatedContent),
                  timestamp: new Date(),
                };
                setMessages(prev => [...prev, finalMessage]);
              }
            } catch (error) {
              console.error('解析事件數據失敗', error);
            }
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('發送訊息失敗:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: '抱歉，我遇到了一些問題。請稍後再試。',
          timestamp: new Date(),
        }
      ]);
      setIsLoading(false);
      setThinkingStatus('idle');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="h-full flex flex-col overflow-x-hidden overflow-y-auto bg-gradient-to-br from-purple-800/30 to-indigo-900/30 backdrop-blur-lg rounded-xl shadow-xl">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">紫微AI助手</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-green-300">在線</span>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto px-1 py-2 ${styles.customScrollbar}`}>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end px-4' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl ${message.role === 'user' ? 'bg-pink-500/80 text-white break-words whitespace-pre-wrap' : 'bg-white/10 backdrop-blur-sm text-white'}`}>
              {message.role === 'user' ? (
                <div
                  className="prose prose-invert prose-sm max-w-none text-white leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
              ) : (
                <div className="prose prose-invert prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: message.content }} />
                </div>
              )}
              <div className="mt-1 text-xs opacity-70 flex justify-between items-center">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {message.role === 'assistant' && (
                  <div className="flex space-x-2">
                    <button className="opacity-50 hover:opacity-100 transition-opacity">
                      <ThumbsUp size={14} />
                    </button>
                    <button className="opacity-50 hover:opacity-100 transition-opacity">
                      <ThumbsDown size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {thinkingStatus === 'waiting' && (
          <div className="flex justify-start px-4 my-2">
            <div className="max-w-[80%] p-3 rounded-xl bg-white/10 backdrop-blur-sm text-white">
              <div className="whitespace-pre-wrap">思考中</div>
              <div className={`ml-1 inline-block ${styles.messageIndicator}`}>
                <div className={styles.thinking}>
                  <span style={{animationDelay: '0s'}}></span>
                  <span style={{animationDelay: '0.2s'}}></span>
                  <span style={{animationDelay: '0.4s'}}></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {thinkingStatus === 'thinking' && (
          <div className="flex justify-start px-4 my-2">
            <div className="max-w-[80%] p-3 rounded-xl bg-white/10 backdrop-blur-sm text-white">
              <div className="whitespace-pre-wrap">通靈中</div>
              <div className={`ml-1 inline-block ${styles.messageIndicator}`}>
                <div className={styles.channeling}>
                  <span style={{animationDelay: '0s'}}></span>
                  <span style={{animationDelay: '0.2s'}}></span>
                  <span style={{animationDelay: '0.4s'}}></span>
                </div>
              </div>
            </div>
          </div>
        )}
        {thinkingStatus === 'responding' && currentAssistantMessage && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-xl bg-white/10 backdrop-blur-sm text-white">
              <div className="prose prose-invert prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: currentAssistantMessage }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-white/10">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="輸入訊息..."
            className="w-full bg-white/10 backdrop-blur-sm text-white rounded-xl p-3 pr-12 resize-none min-h-[44px] max-h-[120px] focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            disabled={isLoading}
          />
          <div className="absolute right-3 bottom-3 flex items-center space-x-2">
            <button type="button" className="text-white/50 hover:text-white transition-colors" title="上傳檔案">
              <Paperclip size={18} />
            </button>
            <button type="button" className="text-white/50 hover:text-white transition-colors" title="語音輸入">
              <Mic size={18} />
            </button>
            <button type="submit" disabled={!input.trim() || isLoading} className={`rounded-full p-1 ${!input.trim() || isLoading ? 'bg-pink-500/50 text-white/50' : 'bg-pink-500 text-white hover:bg-pink-600'} transition-colors`} title="發送">
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center justify-center space-x-2">
          <div className="text-xs text-white/50">建議問題</div>
          <ChevronDown size={14} className="text-white/50" />
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {["紫微命盤中宮位的含義?", "我的事業運勢如何?", "紫微與天府同宮的意義?"].map((q, i) => (
            <button key={i} onClick={() => { setInput(q); if (inputRef.current) inputRef.current.focus(); }} className="text-xs bg-white/10 hover:bg-white/20 text-white/90 px-3 py-1.5 rounded-full transition-colors">
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

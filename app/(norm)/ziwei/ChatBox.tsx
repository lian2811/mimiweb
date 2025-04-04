'use client';
import { formatChatContent } from '@/utils/format';
import { useState, useRef, useEffect } from 'react';
import { Send, ThumbsUp, ThumbsDown, ChevronDown } from 'lucide-react';
import styles from './ChatBox.module.css';
import { extractChartSummary } from '@/utils/ziwei'; // 导入已有的提取函数
import { useTranslations } from 'next-intl';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBoxProps {
  chartData?: any;
  onChartDataUpdate?: (data: any) => void;
}

type ThinkingStatus = 'idle' | 'waiting' | 'thinking' | 'responding';

const ChatBox: React.FC<ChatBoxProps> = ({ chartData, onChartDataUpdate }) => {
  const t = useTranslations('ziwei.chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [streamedContent, setStreamedContent] = useState('');
  const [thinkingStatus, setThinkingStatus] = useState<ThinkingStatus>('idle');
  const thinkingStatusRef = useRef<ThinkingStatus>('idle');
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState('');
  const eventSourceRef = useRef<EventSource | null>(null);
  const streamedContentRef = useRef(''); // 使用 ref 備份當前的流式內容

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 保存最后发送的命盘数据的指纹，用于检测命盘是否有变化
  const lastSentChartRef = useRef<string | null>(null);

  // Cleanup function for EventSource
  const cleanupEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  useEffect(() => {
    thinkingStatusRef.current = thinkingStatus;
  }, [thinkingStatus]);

  // 監聽 streamedContent 變化，同步到 ref
  useEffect(() => {
    streamedContentRef.current = streamedContent;
  }, [streamedContent]);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: t('welcome'),
        timestamp: new Date(),
      },
    ]);

    // Cleanup event source when component unmounts
    return cleanupEventSource;
  }, [t]);

  // 当命盘数据变化时，计算指纹并与先前的指纹比较
  useEffect(() => {
    if (chartData) {
      // 创建命盘数据的简单指纹（使用关键字段组合）
      const currentChartFingerprint = JSON.stringify({
        date: chartData?.horoscope?.solarDate || chartData?.solarDate,
        gender: chartData?.horoscope?.gender || chartData?.gender,
        time: chartData?.horoscope?.time || chartData?.time
      });
      
      // 更新引用，这样我们可以在下次聊天时知道这是最新的命盘
      lastSentChartRef.current = currentChartFingerprint;
    }
  }, [chartData]);

  // Handle scrolling when streaming content
  useEffect(() => {
    if (thinkingStatus === 'responding' && streamedContent) {
      // Instead of scrolling the element into view (which affects the whole page)
      // We scroll the chat container to its maximum scrollHeight
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  }, [streamedContent, thinkingStatus]);

  // Also scroll down when new messages are added
  useEffect(() => {
    if (messages.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize the textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Close any existing connection
    cleanupEventSource();

    // 關閉軟鍵盤 (僅對手機有效)
    if (inputRef.current) {
      inputRef.current.blur();
    }

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
    streamedContentRef.current = ''; // 重置流式內容的 ref
    setCurrentAssistantMessage('');
    setThinkingStatus('waiting');

    try {
      // Create a unique message ID for this request
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Include the query content directly in the SSE connection URL
      const sseUrl = new URL('/api/ziwei', window.location.origin);
      sseUrl.searchParams.append('messageId', messageId);
      sseUrl.searchParams.append('conversationId', conversationId || '');
      sseUrl.searchParams.append('stream', 'true');
      sseUrl.searchParams.append('query', input);
      sseUrl.searchParams.append('user', 'ziwei-user');
      
      // 如果有命盘数据，先生成摘要再传给API，避免数据量过大
      if (chartData) {
        try {
          // 使用utils/ziwei.ts中的extractChartSummary函数生成命盘摘要
          const chartSummary = extractChartSummary(chartData);
          
          // 将精简后的数据传给API
          const chartInfoStr = JSON.stringify(chartSummary);
          sseUrl.searchParams.append('chartInfo', chartInfoStr);
          
        } catch (err) {
          console.error('提取命盘摘要时发生错误:', err);
        }
      }
      
      // Establish SSE connection with all necessary parameters
      const sse = new EventSource(sseUrl.toString());
      eventSourceRef.current = sse;
      
      // Listen for SSE events
      sse.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch(data.event) {
            case 'connection_established':
              setConversationId(data.conversation_id);
              break;
              
            case 'function_calling':
              setThinkingStatus('thinking');
              break;
              
            case 'chart_update':
              if (data.chartData && onChartDataUpdate) {
                // 直接使用函数调用返回的命盘数据完全替换现有命盘
                onChartDataUpdate(data.chartData);
                
                // 更新命盘指纹以跟踪最新的命盘数据
                const newChartFingerprint = JSON.stringify({
                  date: data.chartData?.solarDate || data.chartData?.horoscope?.solarDate,
                  gender: data.chartData?.gender || data.chartData?.horoscope?.gender,
                  time: data.chartData?.time || data.chartData?.horoscope?.time
                });
                
                lastSentChartRef.current = newChartFingerprint;
                console.log("已从AI更新命盘数据，新指纹:", newChartFingerprint);
              }
              break;

            case 'message_token':
              setThinkingStatus('responding');
              if (data.content) {
                
                // 使用函數式更新，確保基於最新的狀態
                setStreamedContent((prevContent) => {
                  const newContent = prevContent + data.content;
                  return newContent;
                });
                
                setCurrentAssistantMessage((prevMessage) => {
                  const newMessage = prevMessage + data.content;
                  streamedContentRef.current = newMessage; // 同步到 ref 以防止丟失
                  return newMessage;
                });
              }
              break;
              
            case 'message_end':
              // 使用 ref 中的內容作為備份，確保不會丟失任何內容
              const finalContent = streamedContentRef.current || currentAssistantMessage;
              
              if (finalContent) {
                setMessages(prev => [
                  ...prev,
                  {
                    id: data.message_id || Date.now().toString(),
                    role: 'assistant',
                    content: finalContent,
                    timestamp: new Date(),
                  }
                ]);
              }
              
              // Close the connection
              cleanupEventSource();
              
              setIsLoading(false);
              setThinkingStatus('idle');
              setStreamedContent('');
              streamedContentRef.current = ''; // 重置流式內容的 ref
              break;
              
            case 'error':
              console.error('SSE event error:', data.error);
              setThinkingStatus('idle');
              setIsLoading(false);
              // 保留當前累積的內容，不要清空它
              break;
          }
        } catch (error) {
          console.error('Error processing SSE message:', error);
        }
      };
      
      // 處理 SSE 連接錯誤
      sse.onerror = (error) => {
        console.error('SSE connection error:', error);
        setThinkingStatus('idle');
        setIsLoading(false);
        
        // 嘗試重新連接
        setTimeout(() => {
          if (eventSourceRef.current === sse) {
            cleanupEventSource();
          }
        }, 1000);
      };
      
    } catch (error) {
      console.error('Error sending message:', error);
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
      {/* 如果有命盤資料，顯示提示信息 */}
      {chartData && (
        <div className="px-4 py-2 bg-green-600/20 border-b border-green-500/30 text-green-300 text-sm flex items-center justify-between">
          <span>
            <span className="font-semibold">{t('chartLoaded')}</span> - {t('aiCanAnalyze')}
          </span>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        </div>
      )}
      
      <div className="p-4 border-b border-white/10 flex justify-between items-center sticky top-0 z-10 bg-gradient-to-br from-purple-800/75 to-indigo-900/75 backdrop-blur-lg">
        <h2 className="text-lg font-bold text-white">{t('assistant')}</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-green-300">{t('online')}</span>
        </div>
      </div>

      <div 
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto px-1 py-2 ${styles.customScrollbar}`}
      >
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end px-2 sm:px-4 mb-3' : 'justify-start px-2 sm:px-4 mb-4'}`}>
            <div 
              className={`max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 rounded-xl ${
                message.role === 'user' 
                  ? 'bg-pink-500/80 text-white break-words whitespace-pre-wrap' 
                  : 'bg-white/10 backdrop-blur-sm text-white'
              }`}
            >
              {message.role === 'user' ? (
                <div className="prose prose-invert prose-sm max-w-none text-white leading-relaxed">
                  {message.content}
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                  <div className={styles.assistantMessage}>
                    {message.id === 'welcome' ? (
                      <div>{message.content}</div>
                    ) : (
                      <div>{formatChatContent(message.content)}</div>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-2 text-xs opacity-70 flex justify-between items-center">
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
          <div className="flex justify-start px-2 sm:px-4 my-2">
            <div className="max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm text-white">
              <div className="whitespace-pre-wrap">{t('thinking')}</div>
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
          <div className="flex justify-start px-2 sm:px-4 my-2">
            <div className="max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm text-white">
              <div className="whitespace-pre-wrap">{t('channeling')}</div>
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
          <div className="flex justify-start px-2 sm:px-4">
            <div className="max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-sm text-white">
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                <div className={styles.assistantMessage}>{formatChatContent(currentAssistantMessage)}</div>
              </div>
              {isLoading && (
                <div className="mt-1 inline-block">
                  <div className={styles.typing}>
                    <span style={{animationDelay: '0s'}}></span>
                    <span style={{animationDelay: '0.2s'}}></span>
                    <span style={{animationDelay: '0.4s'}}></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-white/10 sticky bottom-0 bg-gradient-to-br from-purple-800/75 to-indigo-900/75 backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('inputPlaceholder')}
            className="w-full bg-white/10 backdrop-blur-sm text-white rounded-xl p-3 pr-12 resize-none min-h-[44px] max-h-[120px] focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            disabled={isLoading}
          />
          <div className="absolute right-3 bottom-3 flex items-center space-x-2">
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading} 
              className={`rounded-full p-2 ${!input.trim() || isLoading ? 'bg-pink-500/50 text-white/50' : 'bg-pink-500 text-white hover:bg-pink-600'} transition-colors`} 
              title={t('send')}
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>

      <div className="px-3 pb-3 border-t border-white/10 bg-white/5 pt-2">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="text-xs text-white/50">{t('suggestedQuestions')}</div>
          <ChevronDown size={14} className="text-white/50" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[t('questions.birthInfo'), t('questions.analyzePalace'), t('questions.purpleStar')].map((q, i) => (
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

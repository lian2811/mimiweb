'use client';

import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// 導入組件
import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';
import MessageList from './components/MessageList';
import ModelSettings from './components/ModelSettings';

// 導入類型和配置
import { Message, Conversation } from './components/types';

// 導入服務
import { getChatService } from './services/ChatService';


export default function MimiChatContent() {
  // 用戶會話
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // 狀態
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [showSettings, setShowSettings] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // 對話狀態
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatServiceRef = useRef<any>(null);
  
  // 初始化和設置
  useEffect(() => {
    // 檢查用戶是否已登入
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    // 在客戶端初始化聊天服務
    chatServiceRef.current = getChatService();
    
    // 設置 SSE 事件監聽器
    chatServiceRef.current.setupEventListeners(
      // 處理令牌接收
      (token: string) => {
        setCurrentStreamingMessage(prev => prev + token);
      },
      // 處理流式傳輸完成
      () => {
        setIsStreaming(false);
        setIsLoading(false);
        
        // 將完整消息添加到消息數組
        if (currentStreamingMessage) {
          const newMessage: Message = {
            id: Math.random().toString(36).substring(2, 10),
            role: 'assistant',
            content: currentStreamingMessage,
            timestamp: new Date(),
            model: selectedModel
          };
          
          setMessages(prev => [...prev, newMessage]);
          
          // 如果有活動對話，保存消息到數據庫
          if (activeConversation && session?.user?.id) {
            saveMessageToDatabase(newMessage, activeConversation.id);
          }
          
          setCurrentStreamingMessage('');
        }
      },
      // 處理連接
      (data: any) => {
        console.log('Connected to SSE stream:', data);
      },
      // 處理錯誤
      (error: any) => {
        console.error('SSE connection error:', error);
      }
    );
    
    // 加載用戶的最新對話
    if (session?.user?.id) {
      loadLatestConversation();
    }
    
    // 組件卸載時關閉 SSE 連接
    return () => {
      if (chatServiceRef.current) {
        chatServiceRef.current.close();
      }
    };
  }, [status, session]);
  
  // 加載用戶的對話 - 如果沒有，則創建一個新的
  const loadLatestConversation = async () => {
    if (!session?.user?.id) return;
    
    setIsLoadingConversation(true);
    try {
      // 使用 API 獲取用戶的對話列表
      const response = await fetch(`/api/conversations?userId=${session.user.id}`);
      if (!response.ok) throw new Error('Failed to load conversations');
      
      const data = await response.json();
      const conversations = data.conversations || [];
      
      // 如果有對話，加載第一個
      if (conversations.length > 0) {
        const userConversation = conversations[0];
        setActiveConversation(userConversation);
        setSelectedModel(userConversation.modelId);
        
        // 加載該對話的訊息
        await loadConversationMessages(userConversation.id);
      } else {
        // 如果沒有對話，創建一個新的
        await createUserConversation();
      }
    } catch (error) {
      console.error('Error loading user conversation:', error);
      // 如果加載失敗，嘗試創建新對話
      await createUserConversation();
    } finally {
      setIsLoadingConversation(false);
    }
  };
  
  // 加載對話訊息
  const loadConversationMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (!response.ok) throw new Error('Failed to load messages');
      
      const data = await response.json();
      console.log('Loaded messages:', data.messages);
      setMessages(data.messages || []);
      return data.messages || [];
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  };
  
  // 創建用戶的對話（每個用戶只有一個）
  const createUserConversation = async () => {
    if (!session?.user?.id) return null;
    
    try {
      // 使用 API 創建新對話
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          title: 'MiMi',
          modelId: selectedModel
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create conversation');
      
      const data = await response.json();
      const newConversation = data.conversation;
      
      // 設置為活動對話
      setActiveConversation(newConversation);
      setMessages([]);
      
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };
  
  // 將消息保存到數據庫
  const saveMessageToDatabase = async (message: Message, conversationId: string) => {
    if (!session?.user?.id) return;
    
    try {
      console.log(`保存訊息到對話 ID: ${conversationId}`, message);
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationId
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save message: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('訊息保存成功:', data);
      return data.message;
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };
  
  // 處理滾動事件顯示/隱藏滾動按鈕
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };
    
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  // 消息變化時滾動到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingMessage]);
  
  // 發送消息
  const sendMessage = async () => {
    if (!input.trim() || !chatServiceRef.current) return;
    
    const messageId = Math.random().toString(36).substring(2, 10);
    const userMessage: Message = {
      id: messageId,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    // 更新消息列表
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);
    
    // 如果沒有活動對話，先確保用戶有一個對話
    let currentConversation = activeConversation;
    if (!activeConversation && session?.user?.id) {
      try {
        // 創建用戶的對話
        const newConversation = await createUserConversation();
        if (newConversation) {
          currentConversation = newConversation;
          
          // 創建成功後立即保存用戶訊息
          await saveMessageToDatabase(userMessage, newConversation.id);
        }
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    } else if (activeConversation && session?.user?.id) {
      // 如果已有活動對話，直接保存用戶訊息
      await saveMessageToDatabase(userMessage, activeConversation.id);
    }
    
    // 使用聊天服務發送消息
    chatServiceRef.current.sendMessage(
      selectedModel,
      messages,
      userMessage,
      // 流式更新回調
      (content: string) => {
        setCurrentStreamingMessage(content);
      },
      // 完成回調
      async (content: string) => {
        setIsStreaming(false);
        setIsLoading(false);
        
        // 添加完整消息
        const newMessage: Message = {
          id: Math.random().toString(36).substring(2, 10),
          role: 'assistant',
          content,
          timestamp: new Date(),
          model: selectedModel
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // 保存助手訊息到數據庫
        if (currentConversation && session?.user?.id) {
          await saveMessageToDatabase(newMessage, currentConversation.id);
        }
        
        setCurrentStreamingMessage('');
      },
      // 錯誤回調
      (error: string) => {
        console.error('Error sending message:', error);
        
        setIsStreaming(false);
        setIsLoading(false);
        
        // 添加錯誤消息
        const errorMessage: Message = {
          id: Math.random().toString(36).substring(2, 10),
          role: 'assistant',
          content: `抱歉，處理您的請求時發生錯誤。請稍後再試。`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    );
  };
  
  // 停止生成回應
  const stopGenerating = () => {
    setIsLoading(false);
    setIsStreaming(false);
    if (currentStreamingMessage) {
      const newMessage: Message = {
        id: Math.random().toString(36).substring(2, 10),
        role: 'assistant',
        content: currentStreamingMessage + "\n\n[用戶停止回應]",
        timestamp: new Date(),
        model: selectedModel
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // 保存到數據庫
      if (activeConversation && session?.user?.id) {
        saveMessageToDatabase(newMessage, activeConversation.id);
      }
      
      setCurrentStreamingMessage('');
    }
  };

  // 滾動到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="flex h-screen w-screen">
      {/* 主聊天區域 */}
      <div className="flex flex-col flex-grow bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl">
        {/* 聊天頭部 */}
        <ChatHeader 
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          selectedModel={selectedModel}
          activeConversation={activeConversation}
        />

        {/* 設置面板 */}
        <AnimatePresence>
          {showSettings && (
            <ModelSettings 
              showSettings={showSettings}
              setShowSettings={setShowSettings}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          )}
        </AnimatePresence>

        {/* 聊天消息區域 */}
        <div 
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar"
        >
          {isLoadingConversation ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center h-full text-gray-400"
            >
              <div className="w-24 h-24 mb-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
                <FaRobot className="text-white text-5xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">開始與 Mimi AI 對話</h3>
              <p className="text-md text-gray-400 text-center max-w-md">
                從設置選擇一個模型，並提出問題以開始對話。
                MiMi 可以幫助回答問題、創建內容以及提供實用信息。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6 w-full max-w-lg">
                {["Tell me about Taiwan's history", "Create a project plan for a mobile app", "如何提高工作效率?", "What is the best way to learn programming?"].map((suggestion, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="p-3 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg text-left text-gray-300 text-sm backdrop-blur-sm border border-white/5"
                    onClick={() => setInput(suggestion)}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <MessageList 
              messages={messages}
              isLoading={isLoading}
              streamingContent={currentStreamingMessage}
              selectedModel={selectedModel}
            />
          )}
          
          {/* 滾動到底部按鈕 */}
          <AnimatePresence>
            {showScrollButton && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToBottom}
                className="fixed bottom-24 right-6 z-10 p-3 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
              >
                <FaArrowUp />
              </motion.button>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>

        {/* 輸入區域 */}
        <ChatInput 
          input={input}
          setInput={setInput}
          handleSendMessage={sendMessage}
          isLoading={isLoading}
          isStreaming={isStreaming}
          stopGenerating={stopGenerating}
        />
      </div>
    </div>
  );
}
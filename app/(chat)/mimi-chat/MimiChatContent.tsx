'use client';

import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// 導入組件
import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';
import ChatSidebar from './components/ChatSidebar';
import MessageList from './components/MessageList';
import ModelSettings from './components/ModelSettings';

// 導入類型和配置
import { Message, Conversation, modelOptions } from './components/types';

// 導入服務
import { getChatService } from './services/ChatService';
import { 
  ConversationManager, 
  getMockConversations, 
  getMockMessages 
} from './services/ConversationManager';

export default function MimiChatContent() {
  // 狀態
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState(modelOptions[0].id);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatServiceRef = useRef<any>(null);
  
  // 初始化對話管理器
  const conversationManager = useRef(new ConversationManager([]));
  
  // 初始化和設置
  useEffect(() => {
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
          setCurrentStreamingMessage('');
          
          // 更新對話標題（如果是第一次回覆）
          if (messages.length === 1 && activeConversation) {
            const title = conversationManager.current.generateConversationTitle(messages[0].content);
            conversationManager.current.updateConversationTitle(activeConversation, title);
            setConversations(conversationManager.current.getConversations());
          }
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
    
    // 載入模擬對話
    const mockConversations = getMockConversations();
    conversationManager.current = new ConversationManager(mockConversations);
    setConversations(mockConversations);
    
    // 組件卸載時關閉 SSE 連接
    return () => {
      if (chatServiceRef.current) {
        chatServiceRef.current.close();
      }
    };
  }, []);
  
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

  // 創建新對話
  const createNewConversation = () => {
    const newConversationId = conversationManager.current.createNewConversation(selectedModel);
    setActiveConversation(newConversationId);
    setConversations(conversationManager.current.getConversations());
    setMessages([]);
    setInput('');
  };
  
  // 載入對話
  const loadConversation = (conversationId: string) => {
    conversationManager.current.setActiveConversation(conversationId);
    setActiveConversation(conversationId);
    
    // 找到當前對話並更新選中的模型
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setSelectedModel(conversation.modelId);
    }
    
    // 載入模擬消息
    const mockMessages = getMockMessages(conversationId);
    setMessages(mockMessages);
    
    // 在移動端選擇對話後關閉側邊欄
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };
  
  // 發送消息
  const sendMessage = async () => {
    if (!input.trim() || !chatServiceRef.current) return;
    
    // 如果沒有活動對話，創建一個新對話
    if (!activeConversation) {
      createNewConversation();
    }
    
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
      (content: string) => {
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
        setCurrentStreamingMessage('');
        
        // 更新對話標題（如果是第一次交流）
        if (messages.length === 1 && activeConversation) {
          const title = conversationManager.current.generateConversationTitle(messages[0].content);
          conversationManager.current.updateConversationTitle(activeConversation, title);
          setConversations(conversationManager.current.getConversations());
        }
        
        // 更新對話時間戳
        if (activeConversation) {
          conversationManager.current.updateConversationTimestamp(activeConversation);
          setConversations(conversationManager.current.getConversations());
        }
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
      setCurrentStreamingMessage('');
    }
  };
  
  // 清除聊天歷史
  const clearChat = () => {
    setMessages([]);
    // 如果在對話中，將標題重置為默認值
    if (activeConversation) {
      conversationManager.current.updateConversationTitle(activeConversation, '新對話');
      setConversations(conversationManager.current.getConversations());
    }
  };
  
  // 刪除對話
  const deleteConversation = (id: string) => {
    conversationManager.current.deleteConversation(id);
    setConversations(conversationManager.current.getConversations());
    
    // 如果刪除的是當前活動對話，清除消息
    if (activeConversation === id) {
      setActiveConversation(null);
      setMessages([]);
    }
  };
  
  // 刪除消息
  const handleDeleteMessage = (index: number) => {
    setMessages(prev => prev.filter((_, i) => i !== index));
  };
  
  // 滾動到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="flex h-screen w-screen">
      {/* 側邊欄 - 對話歷史 */}
      <AnimatePresence mode="wait">
        {showSidebar && (
          <ChatSidebar 
            conversations={conversations}
            activeConversation={activeConversation}
            createNewConversation={createNewConversation}
            deleteConversation={deleteConversation}
            setActiveConversation={(id) => {
              if (id) loadConversation(id);
              else setActiveConversation(null);
            }}
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
          />
        )}
      </AnimatePresence>
      
      {/* 主聊天區域 */}
      <div className="flex flex-col flex-grow bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-r-xl rounded-l-xl md:rounded-l-none overflow-hidden shadow-2xl">
        {/* 聊天頭部 */}
        <ChatHeader 
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          clearChat={clearChat}
          selectedModel={selectedModel}
          activeConversation={activeConversation}
          conversations={conversations}
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

        {/* 聊天消息 */}
        <div 
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar"
        >
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center h-full text-gray-400"
            >
              <div className="w-24 h-24 mb-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
                <FaRobot className="text-white text-5xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Start a conversation with Mimi AI</h3>
              <p className="text-md text-gray-400 text-center max-w-md">
                Choose a model from settings and ask a question to get started.
                Mimi can help with questions, creative tasks, and information.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6 w-full max-w-lg">
                {["Tell me about Taiwan's history", "幫我解析紫微命盤", "Create a project plan for a mobile app", "如何提高工作效率?"].map((suggestion, i) => (
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
              onDeleteMessage={handleDeleteMessage}
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
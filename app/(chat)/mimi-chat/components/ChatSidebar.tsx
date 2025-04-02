'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { Conversation, modelOptions } from './types';

interface ChatSidebarProps {
  showSidebar: boolean;
  conversations: Conversation[];
  activeConversation: string | null;
  setActiveConversation: (id: string | null) => void;
  createNewConversation: () => void;
  deleteConversation: (id: string) => void;
  setShowSidebar: (show: boolean) => void; // 添加关闭侧边栏的方法
}

export default function ChatSidebar({
  showSidebar,
  conversations,
  activeConversation,
  setActiveConversation,
  createNewConversation,
  deleteConversation,
  setShowSidebar
}: ChatSidebarProps) {
  // 獲取模型圖標
  const getModelIcon = (modelId: string) => {
    const model = modelOptions.find(m => m.id === modelId);
    return model?.icon || '🤖';
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <AnimatePresence>
      {showSidebar && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-white/10 z-30 shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Conversations</h2>
              {/* 添加关闭按钮 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSidebar(false)}
                className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                aria-label="Close sidebar"
              >
                <FaTimes />
              </motion.button>
            </div>
            
            <div className="p-4 border-b border-white/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={createNewConversation}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium flex items-center justify-center shadow-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-200"
              >
                <FaPlus className="mr-2" /> New Conversation
              </motion.button>
            </div>
            
            <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-2">
              {conversations.length === 0 ? (
                <div className="text-gray-400 text-center p-6">
                  No conversations yet. Start a new one!
                </div>
              ) : (
                conversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg cursor-pointer relative group ${
                      activeConversation === conversation.id
                        ? 'bg-gray-700 shadow-md'
                        : 'bg-gray-800/50 hover:bg-gray-700/70'
                    }`}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-lg">{getModelIcon(conversation.modelId)}</span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-white font-medium truncate pr-6">{conversation.title}</div>
                        <div className="text-xs text-gray-400">{formatDate(conversation.lastUpdated)}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                      className="absolute right-2 top-2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete conversation"
                    >
                      <FaTrash size={14} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-white/10 text-xs text-center text-gray-500">
              Your conversations are stored locally in your browser.
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
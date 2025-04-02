'use client';

import { motion } from 'framer-motion';
import { FaCog, FaTrash } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md'; // 修復 import 路徑
import { Conversation, modelOptions } from './types';

interface ChatHeaderProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  clearChat: () => void;
  selectedModel: string;
  activeConversation: string | null;
  conversations: Conversation[];
}

export default function ChatHeader({
  showSidebar,
  setShowSidebar,
  showSettings,
  setShowSettings,
  clearChat,
  selectedModel,
  activeConversation,
  conversations
}: ChatHeaderProps) {
  // 獲取模型名稱
  const getModelName = (modelId: string) => {
    const model = modelOptions.find(m => m.id === modelId);
    return model ? model.name : modelId;
  };

  // 獲取模型圖標
  const getModelIcon = (modelId: string) => {
    const model = modelOptions.find(m => m.id === modelId);
    return model?.icon || '🤖';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex justify-between items-center p-4 border-b border-white/10 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-md shadow-md"
    >
      <div className="flex items-center">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 mr-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-md"
          title="Conversations"
        >
          <MdMenu />
        </motion.button>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2 text-xl">{getModelIcon(selectedModel)}</span>
            {activeConversation 
              ? conversations.find(c => c.id === activeConversation)?.title || 'Chat'
              : 'Mimi Chat'}
          </h1>
          {activeConversation && (
            <div className="text-xs text-gray-400">
              Powered by {getModelName(selectedModel)}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-md"
          title="Settings"
        >
          <FaCog />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={clearChat}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-md"
          title="Clear chat"
        >
          <FaTrash />
        </motion.button>
      </div>
    </motion.div>
  );
}
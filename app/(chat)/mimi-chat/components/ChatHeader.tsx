'use client';

import { motion } from 'framer-motion';
import { FaCog } from 'react-icons/fa';
import { Conversation, modelOptions } from './types';

interface ChatHeaderProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  selectedModel: string;
  activeConversation: Conversation | null;
}

export default function ChatHeader({
  showSettings,
  setShowSettings,
  selectedModel,
  activeConversation
}: ChatHeaderProps) {
  // 獲取模型名稱
  const getModelName = (modelId: string) => {
    const model = modelOptions.find(m => m.id === modelId);
    return model ? model.name : modelId;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-700 p-4 flex justify-between items-center shadow-md z-10"
    >
      <div className="flex items-center">
        <div>
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 text-xl font-bold flex items-center">
            {activeConversation
              ? activeConversation.title
              : 'MiMi'}
          </h1>
          <div className="text-xs text-gray-400">
            {getModelName(selectedModel)}
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-md"
          title="設定"
        >
          <FaCog />
        </motion.button>
      </div>
    </motion.div>
  );
}
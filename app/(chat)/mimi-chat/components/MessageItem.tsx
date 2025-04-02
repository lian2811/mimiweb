'use client';

import { useState } from 'react';
import { FaUser, FaCopy, FaCheck, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Message, modelOptions } from './types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageItemProps {
  message: Message;
  onDelete?: () => void;
}

export default function MessageItem({ message, onDelete }: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  
  const isUser = message.role === 'user';
  
  // 獲取模型圖標
  const getModelIcon = (modelId: string) => {
    const model = modelOptions.find(m => m.id === modelId);
    return model?.icon || '🤖';
  };
  
  // 複製文本到剪貼板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 ${isUser ? 'bg-blue-900/30' : 'bg-gray-800/40'} backdrop-blur-sm rounded-xl shadow-lg`}
    >
      <div className="flex mb-2 items-center">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-lg mr-2 shadow-md">
            <FaUser size={14} />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-lg mr-2 shadow-md">
            {getModelIcon(message.model || 'gemini')}
          </div>
        )}
        <div className="font-medium text-white">
          {isUser ? 'You' : 'Mimi AI'}
        </div>
        
        <div className="ml-auto flex space-x-2">
          {!isUser && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Copy message"
            >
              {copied ? <FaCheck size={14} className="text-green-500" /> : <FaCopy size={14} />}
            </motion.button>
          )}
          
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDelete}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label="Delete message"
            >
              <FaTrash size={14} />
            </motion.button>
          )}
        </div>
      </div>
      
      <div className="pl-10 text-gray-300 space-y-4 markdown-content">
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ReactMarkdown
            components={{
              code({inline, className, children, ...props}: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomDark as any}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
}
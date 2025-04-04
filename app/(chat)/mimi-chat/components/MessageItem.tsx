'use client';

import { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Message, modelOptions } from './types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageItemProps {
  message: Message;
  onDelete?: () => void;
}

export default function MessageItem({ message }: MessageItemProps) {
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

  // 改進訊息框使其更緊貼文字內容
  const containerStyles = isUser
    ? 'ml-auto max-w-[70%] min-w-[60px] text-right' // 使用者訊息顯示在右側，文字靠右
    : 'mr-auto max-w-[70%] min-w-[60px] text-left'; // AI 訊息顯示在左側，文字靠左

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${containerStyles} mb-2`}
    >
      <div className={`inline-block px-3 py-2 ${isUser ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80' : 'bg-gradient-to-r from-gray-800/90 to-gray-700/80'} backdrop-blur-sm rounded-xl shadow-lg border ${isUser ? 'border-blue-500/30' : 'border-gray-600/30'}`}>
        {/* 用戶訊息不顯示頭部元素 */}
        {!isUser && (
          <div className="flex mb-1 items-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm mr-2 shadow-md">
              {getModelIcon(message.model || 'gemini')}
            </div>
            <div className="font-medium text-white text-sm">
              MiMi AI
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              className="ml-auto text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Copy message"
            >
              {copied ? <FaCheck size={12} className="text-green-500" /> : <FaCopy size={12} />}
            </motion.button>
          </div>
        )}
        
        <div className={`${isUser ? '' : 'pl-7'} text-gray-200 markdown-content`}>
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
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
                    <code className={`px-1 py-0.5 rounded bg-gray-700 ${className}`} {...props}>
                      {children}
                    </code>
                  );
                },
                p: ({children}) => <p className="my-1 text-sm leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="list-disc pl-4 my-1 text-sm">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal pl-4 my-1 text-sm">{children}</ol>,
                li: ({children}) => <li className="my-0.5 text-sm">{children}</li>,
                h1: ({children}) => <h1 className="text-lg font-bold mt-3 mb-1 text-sm">{children}</h1>,
                h2: ({children}) => <h2 className="text-base font-bold mt-2 mb-1 text-sm">{children}</h2>,
                h3: ({children}) => <h3 className="text-sm font-bold mt-1 mb-0.5">{children}</h3>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-gray-500 pl-3 italic my-1 text-sm">{children}</blockquote>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </motion.div>
  );
}
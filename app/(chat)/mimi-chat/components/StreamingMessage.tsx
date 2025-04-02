'use client';

import { useEffect, useState } from 'react';
import { FaDotCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { modelOptions } from './types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface StreamingMessageProps {
  content: string;
  selectedModel: string;
}

export default function StreamingMessage({ content, selectedModel }: StreamingMessageProps) {
  const [blinkingDot, setBlinkingDot] = useState(true);
  
  // 獲取選中模型的圖標
  const getModelIcon = (modelId: string) => {
    const model = modelOptions.find(m => m.id === modelId);
    return model?.icon || '🤖';
  };

  // 閃爍的效果
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkingDot(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-gray-800/40 backdrop-blur-sm rounded-xl shadow-lg"
    >
      <div className="flex mb-2 items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-lg mr-2 shadow-md">
          {getModelIcon(selectedModel)}
        </div>
        <div className="font-medium text-white">
          Mimi AI
          <span className="inline-flex items-center ml-2 text-blue-400 text-sm">
            <FaDotCircle 
              className={`mr-1 transition-opacity duration-300 ${blinkingDot ? 'opacity-100' : 'opacity-30'}`} 
              size={10} 
            />
            typing
          </span>
        </div>
      </div>
      
      <div className="pl-10 text-gray-300 space-y-4 markdown-content">
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
          {content}
        </ReactMarkdown>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
          className="inline-block w-2 h-4 bg-blue-500 ml-1"
        />
      </div>
    </motion.div>
  );
}
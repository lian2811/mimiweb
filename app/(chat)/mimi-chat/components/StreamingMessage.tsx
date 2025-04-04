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
      className="mr-auto max-w-[85%] md:max-w-[75%] lg:max-w-[65%]"
    >
      <div className="p-4 bg-gradient-to-r from-gray-800/90 to-gray-700/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-600/30">
        <div className="flex mb-2 items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-lg mr-2 shadow-md">
            {getModelIcon(selectedModel)}
          </div>
          <div className="font-medium text-white">
            MiMi AI
            <span className="inline-flex items-center ml-2 text-blue-400 text-sm">
              <FaDotCircle 
                className={`mr-1 transition-opacity duration-300 ${blinkingDot ? 'opacity-100' : 'opacity-30'}`} 
                size={10} 
              />
              typing
            </span>
          </div>
        </div>
        
        <div className="pl-10 text-gray-200 space-y-4 markdown-content">
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
              p: ({children}) => <p className="my-2">{children}</p>,
              ul: ({children}) => <ul className="list-disc pl-4 my-3">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal pl-4 my-3">{children}</ol>,
              li: ({children}) => <li className="my-1">{children}</li>,
              h1: ({children}) => <h1 className="text-xl font-bold mt-6 mb-2">{children}</h1>,
              h2: ({children}) => <h2 className="text-lg font-bold mt-5 mb-2">{children}</h2>,
              h3: ({children}) => <h3 className="text-md font-bold mt-4 mb-2">{children}</h3>,
              blockquote: ({children}) => <blockquote className="border-l-4 border-gray-500 pl-4 italic my-3">{children}</blockquote>,
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
      </div>
    </motion.div>
  );
}
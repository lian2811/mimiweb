'use client';
import { FaRobot } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Message } from './types';
import MessageItem from './MessageItem';
import StreamingMessage from './StreamingMessage';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  selectedModel: string;
  onDeleteMessage?: (index: number) => void;
}

const MessageList = ({ 
  messages, 
  isLoading, 
  streamingContent,
  selectedModel
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 聊天自動滾動到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="flex-1 overflow-y-auto py-4 px-6 space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-6 rounded-xl bg-gray-800/40 backdrop-blur-sm max-w-lg">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">歡迎使用 Mimi AI 智能助手</h3>
            <p className="text-gray-300 mb-4">
              我是您的個人AI助手，可以回答問題、創作內容、進行翻譯、提供建議以及更多功能。
              請輸入您的問題開始對話吧！
            </p>
            <div className="grid grid-cols-1 gap-3 text-sm text-left">
              <button 
                className="p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/80 text-gray-200 transition-colors text-left"
                onClick={() => {/* TODO: 實現快速提示發送 */}}
              >
                &ldquo;解釋量子計算的基本原理&rdquo;
              </button>
              <button 
                className="p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/80 text-gray-200 transition-colors text-left"
                onClick={() => {/* TODO: 實現快速提示發送 */}}
              >
                &ldquo;幫我寫一首關於春天的短詩&rdquo;
              </button>
              <button 
                className="p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/80 text-gray-200 transition-colors text-left"
                onClick={() => {/* TODO: 實現快速提示發送 */}}
              >
                &ldquo;分析台灣經濟與世界經濟的關係&rdquo;
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <MessageItem 
              key={index} 
              message={message}
            />
          ))}
          
          {isLoading && streamingContent && (
            <StreamingMessage 
              content={streamingContent} 
              selectedModel={selectedModel} 
            />
          )}
          
          {messages.length > 0 && !isLoading && !streamingContent && (
            <div className="flex justify-center my-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 text-sm bg-gray-800/30 px-4 py-2 rounded-full shadow border border-gray-700/50"
              >
                <div className="flex items-center space-x-2">
                  <FaRobot className="text-blue-400" />
                  <span>Mimi is ready for your next question</span>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </motion.div>
  );
};

export default MessageList;
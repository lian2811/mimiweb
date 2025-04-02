'use client';

import { useRef, useEffect } from 'react';
import { FaPaperPlane, FaStop } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  isStreaming: boolean;
  stopGenerating: () => void;
}

export default function ChatInput({
  input,
  setInput,
  handleSendMessage,
  isLoading,
  isStreaming,
  stopGenerating
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自動調整文本區域高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  // 處理發送
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      handleSendMessage();
    }
  };

  // 處理鍵盤快捷鍵
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSendMessage();
      }
    }
  };

  return (
    <div className="p-4 border-t border-white/10 bg-gray-900/95 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end">
          <motion.textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Mimi AI anything..."
            rows={1}
            className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 rounded-2xl px-4 py-3 pr-16 text-white resize-none transition-all duration-200 custom-scrollbar"
            disabled={isLoading}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          />

          <div className="absolute right-3 bottom-3">
            {isStreaming ? (
              <motion.button
                type="button"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={stopGenerating}
                className="p-2 rounded-full bg-red-600 text-white shadow-lg"
                aria-label="Stop generating"
              >
                <FaStop />
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-full ${
                  !input.trim() || isLoading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white shadow-lg hover:bg-blue-500'
                } transition-colors`}
                aria-label="Send message"
              >
                <FaPaperPlane />
              </motion.button>
            )}
          </div>
        </div>
      </form>
      <div className="text-center text-xs text-gray-500 mt-2">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}
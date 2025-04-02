'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { modelOptions } from './types';

interface ModelSettingsProps {
  showSettings: boolean;
  selectedModel: string;
  setSelectedModel: (modelId: string) => void;
  setShowSettings: (show: boolean) => void;
}

export default function ModelSettings({
  showSettings,
  selectedModel,
  setSelectedModel,
  setShowSettings
}: ModelSettingsProps) {
  return (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Model Settings</h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white/90">Select AI Model</h3>
              <div className="grid gap-3">
                {modelOptions.map((model) => (
                  <motion.div
                    key={model.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedModel === model.id
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-700 bg-gray-800/40 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className="flex items-start">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${model.accentColor} flex items-center justify-center text-xl shadow-lg mr-3`}>
                        {model.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{model.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">{model.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(false)}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-lg hover:bg-blue-500 transition-colors"
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
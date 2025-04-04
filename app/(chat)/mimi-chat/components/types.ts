// 定義消息結構
export interface Message {
  id: string;
  role: string;  // 改為更寬鬆的 string 類型，以便與資料庫返回的數據相容
  content: string;
  timestamp: Date;
  model?: string | null;  // 將 model 類型改為 string | null | undefined，以便與資料庫返回的數據相容
  conversationId?: string;  // 添加此屬性，與資料庫結構相符
}

// 定義對話結構
export interface Conversation {
  id: string;
  title: string;
  lastUpdated: Date;
  modelId: string;
  userId?: string;  // 添加此屬性，與資料庫結構相符
}

// 定義模型選項
export interface ModelOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
}

// 預定義模型選項
export const modelOptions: ModelOption[] = [
  { 
    id: 'gemini', 
    name: 'Gemini AI', 
    description: 'Google Gemini model - Advanced reasoning and instructions',
    icon: '✨',
    accentColor: 'from-teal-400 to-teal-600'
  },
  { 
    id: 'mcp-ziwei', 
    name: 'MCP Ziwei Specialist', 
    description: '紫微斗數專家 - 專門解析紫微命盤和占卜',
    icon: '🔮',
    accentColor: 'from-pink-400 to-pink-600'
  },
  { 
    id: 'hybrid-qa', 
    name: 'Hybrid Knowledge', 
    description: 'Knowledge base integration using MCP hybrid search',
    icon: '📚',
    accentColor: 'from-teal-500 to-cyan-600'
  }
];
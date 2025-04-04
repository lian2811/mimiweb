// app/mimi-chat/services/ChatService.ts
import { Message } from '../components/types';
import { getGeminiSystemInstructionText } from '@/utils/gemini';

// 配置常量
const API_ENDPOINTS = {
  MCP: '/api/mcp',
  GEMINI: '/api/gemini'  // 修正 Gemini API 的端點
};

// MCP 工具 ID
const MCP_TOOLS = {
  ZIWEI_SPECIALIST: 'ziwei-specialist-chat',
  OPENAI_CHAT: 'openai-chat'
};

// 模擬流式響應的打字速度（毫秒/字符）
const TYPING_SPEED = 15;

// 定義不同模型的系統提示詞
const MODEL_SYSTEM_PROMPTS = {
  gemini: getGeminiSystemInstructionText(),
  'mcp-ziwei': `你是一位精通紫微斗數的命理師，名字叫MiMi。您能根據用戶提供的生辰八字生成紫微命盤，並作出專業詳盡的解讀。請用繁體中文回應。`,
};

/**
 * 檢查是否在瀏覽器環境中運行
 */
const isBrowser = typeof window !== 'undefined';

/**
 * 聊天服務類，處理與後端 API 的通信
 */
export class ChatService {
  private sessionId: string;
  private eventSource: any | null = null;
  private geminiEventSource: any | null = null;
  
  constructor() {
    this.sessionId = Math.random().toString(36).substring(2, 15);
    // 只在瀏覽器端初始化 EventSource
    if (isBrowser) {
      this.initEventSource();
    }
  }
  
  /**
   * 初始化 SSE 連接
   */
  private initEventSource(): void {
    if (isBrowser) {
      this.eventSource = new EventSource(`${API_ENDPOINTS.MCP}?sessionId=${this.sessionId}`);
    }
  }
  
  /**
   * 設置 SSE 事件監聽器
   */
  public setupEventListeners(
    onToken: (token: string) => void,
    onDone: () => void,
    onConnected: (data: any) => void,
    onError: (error: any) => void
  ): void {
    if (!isBrowser || !this.eventSource) return;
    
    this.eventSource.addEventListener('connected', (e: any) => {
      try {
        const data = JSON.parse(e.data);
        onConnected(data);
      } catch (error) {
        console.error('Error parsing connected event:', error);
      }
    });

    this.eventSource.addEventListener('error', (e: any) => {
      onError(e);
    });

    this.eventSource.addEventListener('token', (e: any) => {
      try {
        const data = JSON.parse(e.data);
        if (data.token) {
          onToken(data.token);
        }
      } catch (error) {
        console.error('Error parsing token event:', error);
      }
    });

    this.eventSource.addEventListener('done', () => {
      onDone();
    });
  }
  
  /**
   * 發送消息到 API 並處理響應
   */
  public async sendMessage(
    selectedModel: string,
    messages: Message[],
    userMessage: Message,
    onStreamingUpdate: (content: string) => void,
    onComplete: (content: string) => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      // 對於 Gemini 模型，使用 POST 請求處理
      if (selectedModel === 'gemini') {
        try {
          // 獲取 Gemini 模型的系統提示詞
          const systemPrompt = MODEL_SYSTEM_PROMPTS.gemini;
          
          // 使用普通的 POST 請求來避免 SSE 連接的問題
          const response = await fetch(API_ENDPOINTS.GEMINI, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [...messages, userMessage].map(msg => ({
                role: msg.role,
                content: msg.content
              })),
              systemPrompt: systemPrompt // 傳遞系統提示詞
            }),
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();
          
          // 提取回覆文本
          const assistantContent = data.message || data.content || "No response received";
          
          // 使用打字效果模擬流式響應
          let currentIndex = 0;
          onStreamingUpdate('');
          
          const typingInterval = setInterval(() => {
            if (currentIndex < assistantContent.length) {
              currentIndex++;
              onStreamingUpdate(assistantContent.substring(0, currentIndex));
            } else {
              clearInterval(typingInterval);
              onComplete(assistantContent);
            }
          }, TYPING_SPEED);
        } catch (error) {
          console.error('Error with Gemini API:', error);
          onError(error instanceof Error ? error.message : 'An error occurred with the Gemini API');
        }
        
        return;
      }
      
      // 對於其他模型，使用原有的方法
      // 選擇合適的 API 端點
      let endpoint = API_ENDPOINTS.MCP;
      let payload: any = {
        sessionId: this.sessionId,
        type: 'invoke',
        tool: selectedModel === 'mcp-ziwei' 
          ? MCP_TOOLS.ZIWEI_SPECIALIST
          : MCP_TOOLS.OPENAI_CHAT,
        params: {
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          use_functions: selectedModel === 'mcp-ziwei',
          stream: true
        }
      };

      // 發送請求
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // 模擬流式響應
      const data = await response.json();
      
      // 提取助手的消息
      const assistantContent = data.result?.content?.[0]?.text || "No response received";

      // 使用打字效果模擬流式響應
      let currentIndex = 0;
      onStreamingUpdate('');
      
      const typingInterval = setInterval(() => {
        if (currentIndex < assistantContent.length) {
          currentIndex++;
          onStreamingUpdate(assistantContent.substring(0, currentIndex));
        } else {
          clearInterval(typingInterval);
          onComplete(assistantContent);
        }
      }, TYPING_SPEED);
      
      return;
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      onError(error.message || 'An error occurred while sending your message');
    }
  }
  
  /**
   * 關閉 SSE 連接
   */
  public close(): void {
    if (isBrowser) {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
      if (this.geminiEventSource) {
        this.geminiEventSource.close();
        this.geminiEventSource = null;
      }
    }
  }
  
  /**
   * 獲取會話 ID
   */
  public getSessionId(): string {
    return this.sessionId;
  }
}

// 導出單例服務實例
// 只在客戶端創建服務實例
let chatServiceSingleton: ChatService;

// 使用一個工廠函數代替直接實例化
export const getChatService = () => {
  if (isBrowser) {
    if (!chatServiceSingleton) {
      chatServiceSingleton = new ChatService();
    }
    return chatServiceSingleton;
  }
  
  // 在服務器端返回一個空的實現
  return {
      setupEventListeners: () => { },
      sendMessage: async () => { },
      close: () => { },
      getSessionId: () => ''
  } as unknown as ChatService;
};

// 導出一個函數供客戶端使用
export const chatService = isBrowser 
  ? getChatService() 
  : null as unknown as ChatService;
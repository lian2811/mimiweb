// app/mimi-chat/services/ConversationManager.ts
import { Message, Conversation, modelOptions } from '../components/types';

/**
 * 對話管理類，處理對話的創建、加載和更新
 */
export class ConversationManager {
  private conversations: Conversation[] = [];
  private activeConversation: string | null = null;
  
  constructor(initialConversations: Conversation[] = []) {
    this.conversations = initialConversations;
  }
  
  /**
   * 獲取所有對話
   */
  public getConversations(): Conversation[] {
    return this.conversations;
  }
  
  /**
   * 獲取當前活動對話
   */
  public getActiveConversation(): Conversation | null {
    if (!this.activeConversation) return null;
    return this.conversations.find(conv => conv.id === this.activeConversation) || null;
  }
  
  /**
   * 獲取當前活動對話ID
   */
  public getActiveConversationId(): string | null {
    return this.activeConversation;
  }
  
  /**
   * 設置活動對話
   */
  public setActiveConversation(conversationId: string | null): void {
    this.activeConversation = conversationId;
  }
  
  /**
   * 創建新對話
   */
  public createNewConversation(modelId: string): string {
    const newConversationId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'MiMi',
      lastUpdated: new Date(),
      modelId
    };
    
    this.conversations = [newConversation, ...this.conversations];
    this.activeConversation = newConversationId;
    
    return newConversationId;
  }
  
  /**
   * 更新對話標題
   */
  public updateConversationTitle(conversationId: string, newTitle: string): void {
    this.conversations = this.conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, title: newTitle } 
        : conv
    );
  }
  
  /**
   * 更新對話的最後活動時間
   */
  public updateConversationTimestamp(conversationId: string): void {
    this.conversations = this.conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, lastUpdated: new Date() } 
        : conv
    );
  }
  
  /**
   * 刪除對話
   */
  public deleteConversation(conversationId: string): void {
    this.conversations = this.conversations.filter(conv => conv.id !== conversationId);
    
    // 如果刪除的是當前活動對話，則清除活動對話
    if (this.activeConversation === conversationId) {
      this.activeConversation = null;
    }
  }
  
  /**
   * 從對話的第一條消息生成標題
   */
  public generateConversationTitle(firstMessage: string): string {
    const words = firstMessage.split(' ');
    return words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
  }
  
  /**
   * 獲取模型名稱
   */
  public static getModelName(modelId: string): string {
    const model = modelOptions.find(m => m.id === modelId);
    return model ? model.name : modelId;
  }
  
  /**
   * 獲取模型圖標
   */
  public static getModelIcon(modelId: string): string {
    const model = modelOptions.find(m => m.id === modelId);
    return model?.icon || '🤖';
  }
  
  /**
   * 獲取模型強調色
   */
  public static getModelAccentColor(modelId: string): string {
    const model = modelOptions.find(m => m.id === modelId);
    return model?.accentColor || 'from-blue-500 to-teal-600';
  }
  
  /**
   * 格式化相對時間
   */
  public static formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }
}

// 初始化對話示例
export const getMockConversations = (): Conversation[] => [
  {
    id: 'conv-1',
    title: '紫微命盤分析',
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
    modelId: 'mcp-ziwei'
  },
  {
    id: 'conv-2',
    title: 'Helping with project plan',
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    modelId: 'gemini'
  }
];

// 獲取模擬消息歷史
export const getMockMessages = (conversationId: string): Message[] => {
  if (conversationId === 'conv-1') {
    return [
      {
        id: '1',
        role: 'user',
        content: '我的生日是1990年5月15日，早上7點出生，請幫我分析紫微命盤',
        timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000)
      },
      {
        id: '2',
        role: 'assistant',
        content: '根據您提供的生日資訊，我已為您生成紫微命盤。\n\n**命宮分析：**\n您的命宮落在巳宮，有紫微星坐守，代表您天生具有領導能力，性格堅毅果斷。紫微星是紫微斗數中的主星之一，象徵權威、尊貴和智慧。\n\n**財帛宮分析：**\n您的財帛宮有祿存，代表財運不錯，但可能需要通過自身努力才能獲得理想的財富。\n\n**事業宮：**\n事業宮有天機星，表示您在職場中頭腦靈活，有創新能力，適合從事需要創意和思考的工作。\n\n以上僅是簡單分析，完整的紫微命盤解讀需要考慮更多細節。',
        timestamp: new Date(Date.now() - 24.8 * 60 * 60 * 1000),
        model: 'mcp-ziwei'
      }
    ];
  } else if (conversationId === 'conv-2') {
    return [
      {
        id: '3',
        role: 'user',
        content: 'Can you help me create a project plan for developing a new mobile app?',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: '4',
        role: 'assistant',
        content: "# Mobile App Development Project Plan\n\n## Phase 1: Planning & Research (2-4 weeks)\n- Define app purpose and target audience\n- Competitive analysis\n- Define core features and MVP scope\n- User journey mapping\n- Technical requirements gathering\n\n## Phase 2: Design (3-4 weeks)\n- Wireframing key screens\n- User testing of wireframes\n- UI design\n- Design system creation\n- Prototyping and user testing\n\n## Phase 3: Development (8-12 weeks)\n- Environment setup\n- Frontend development\n- Backend development\n- API integration\n- Regular testing cycles\n\n## Phase 4: Testing & QA (2-4 weeks)\n- Functional testing\n- Performance testing\n- Security testing\n- User acceptance testing\n- Bug fixing\n\n## Phase 5: Deployment & Launch (1-2 weeks)\n- App store submission\n- Marketing preparations\n- Analytics setup\n- Launch plan execution\n\n## Phase 6: Post-Launch (Ongoing)\n- User feedback collection\n- Performance monitoring\n- Bug fixes and updates\n- Feature enhancement planning\n\nWould you like me to elaborate on any specific phase?",
        timestamp: new Date(Date.now() - 2.8 * 60 * 60 * 1000),
        model: 'gemini'
      }
    ];
  }
  
  return [];
};
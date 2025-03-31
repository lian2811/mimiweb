/**
 * 对话管理工具
 * 提供对话历史记录和命盘数据的管理功能
 */


// 对话消息类型
export type MessageRole = 'user' | 'model';


// 定义 ContentPart 类型
export type ContentPart = {
  text?: string;
  functionCall?: {
    name: string;
    args: any;
  };
  functionResponse?: {
    name: string;
    response: any;
  };
  content?: string;
  parts?: ContentPart[];
};

// 对话消息接口
interface ConversationMessage {
  role: MessageRole;
  parts: ContentPart[];
  timestamp: number;
}

// 对话状态接口
interface ConversationState {
  history: ConversationMessage[];
  lastAccess: number;
  chartData?: any; // 命盘数据
}

// 对话存储映射
const conversations = new Map<string, ConversationState>();

// 对话有效期（6小时）
const CONVERSATION_TTL = 6 * 60 * 60 * 1000;

/**
 * 获取或创建对话
 * @param conversationId 对话ID（可选）
 * @returns 对话ID和对话状态
 */
export function getOrCreateConversation(conversationId?: string): { 
  conversationId: string; 
  conversation: ConversationState;
  isNew: boolean;
} {
  const now = Date.now();
  
  // 如果提供了对话ID且存在，返回现有对话
  if (conversationId && conversations.has(conversationId)) {
    const conversation = conversations.get(conversationId)!;
    conversation.lastAccess = now;
    return { 
      conversationId, 
      conversation,
      isNew: false
    };
  }
  
  // 否则创建新对话
  const newId = conversationId || `conv_${now}_${Math.random().toString(36).substring(2, 9)}`;
  const newConversation: ConversationState = {
    history: [],
    lastAccess: now
  };
  
  conversations.set(newId, newConversation);
  return { 
    conversationId: newId, 
    conversation: newConversation,
    isNew: true
  };
}

/**
 * 向对话添加消息
 * @param conversationId 对话ID
 * @param role 消息角色
 * @param parts 消息部分
 * @returns 添加的消息
 */
export function addMessageToConversation(
  conversationId: string, 
  role: MessageRole, 
  parts: ContentPart[]
): ConversationMessage | null {
  // 获取对话
  if (!conversations.has(conversationId)) {
    console.error(`Conversation ${conversationId} not found`);
    return null;
  }
  
  const conversation = conversations.get(conversationId)!;
  conversation.lastAccess = Date.now();
  
  // 创建新消息
  const message: ConversationMessage = {
    role,
    parts,
    timestamp: Date.now()
  };
  
  // 添加到历史记录
  conversation.history.push(message);
  
  return message;
}

/**
 * 获取格式化的历史记录，用于AI聊天上下文
 * @param conversationId 对话ID
 * @returns 格式化的历史记录
 */
export function getFormattedHistory(conversationId: string): any[] {
  if (!conversations.has(conversationId)) {
    return [];
  }
  
  const conversation = conversations.get(conversationId)!;
  conversation.lastAccess = Date.now();
  
  // 将历史记录格式化为AI聊天期望的格式
  return conversation.history.map(message => ({
    role: message.role,
    parts: message.parts
  }));
}

/**
 * 在对话中存储命盘数据
 * @param conversationId 对话ID
 * @param chartData 命盘数据
 * @returns 是否成功存储
 */
export function storeChartDataInConversation(
  conversationId: string, 
  chartData: any
): boolean {
  // 获取对话
  if (!conversations.has(conversationId)) {
    console.error(`Conversation ${conversationId} not found`);
    return false;
  }
  
  const conversation = conversations.get(conversationId)!;
  conversation.lastAccess = Date.now();
  conversation.chartData = chartData;

  return true;

}

/**
 * 从对话中获取命盘数据
 * @param conversationId 对话ID
 * @returns 命盘数据或null
 */
export function getChartDataFromConversation(conversationId: string): any | null {
  // 获取对话
  if (!conversations.has(conversationId)) {
    return null;
  }
  
  const conversation = conversations.get(conversationId)!;
  conversation.lastAccess = Date.now();
  
  return conversation.chartData || null;
}

/**
 * 清理旧的对话
 */
export function cleanupOldConversations(): void {
  const now = Date.now();
  
  for (const [id, conversation] of conversations.entries()) {
    if (now - conversation.lastAccess > CONVERSATION_TTL) {
      conversations.delete(id);
    }
  }
}

// 定期清理旧的对话（每小时）
setInterval(cleanupOldConversations, 60 * 60 * 1000);
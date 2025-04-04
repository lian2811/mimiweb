// app/mimi-chat/services/ConversationService.ts
import { mongoPrisma } from '@/lib/mongoPrisma';
import { Message, Conversation } from '../components/types';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/utils/auth';

export class ConversationService {
  /**
   * 獲取當前用戶的所有對話
   */
  public static async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const conversations = await mongoPrisma.mongoConversation.findMany({
        where: { userId },
        orderBy: { lastUpdated: 'desc' },
      });
      
      return conversations;
    } catch (error) {
      console.error('獲取對話失敗:', error);
      return [];
    }
  }
  
  /**
   * 獲取對話的所有訊息
   */
  public static async getConversationMessages(conversationId: string): Promise<Message[]> {
    try {
      const messages = await mongoPrisma.mongoMessage.findMany({
        where: { conversationId },
        orderBy: { timestamp: 'asc' },
      });
      
      return messages;
    } catch (error) {
      console.error('獲取訊息失敗:', error);
      return [];
    }
  }
  
  /**
   * 創建新對話
   */
  public static async createConversation(userId: string, title: string, modelId: string): Promise<Conversation | null> {
    try {
      const conversationId = `conv-${Date.now()}`;
      const conversation = await mongoPrisma.mongoConversation.create({
        data: {
          id: conversationId,
          title,
          modelId,
          lastUpdated: new Date(),
          userId,
        }
      });
      
      return conversation;
    } catch (error) {
      console.error('創建對話失敗:', error);
      return null;
    }
  }
  
  /**
   * 保存訊息
   */
  public static async saveMessage(message: Message, conversationId: string): Promise<Message | null> {
    try {
      const savedMessage = await mongoPrisma.mongoMessage.create({
        data: {
          id: message.id,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp,
          model: message.model,
          conversationId,
        }
      });
      
      // 更新對話的最後更新時間
      await mongoPrisma.mongoConversation.update({
        where: { id: conversationId },
        data: { lastUpdated: new Date() }
      });
      
      // 記錄重要的助手訊息到記憶集合
      if (message.role === 'assistant') {
        try {
          const userId = await this.getUserIdByConversationId(conversationId);
          console.log('嘗試將助手訊息保存到記憶中，用戶ID:', userId);
          
          if (!userId) {
            console.warn('無法獲取用戶 ID，跳過保存到記憶');
            return savedMessage;
          }
          
          const memoryData = {
            userId,
            content: message.content,
            type: 'CONVERSATION',
            importance: 5, // 預設中等重要性
            metadata: {
              conversationId,
              messageId: message.id,
              timestamp: message.timestamp,
              model: message.model
            }
          };
          
          const savedMemory = await mongoPrisma.mongoMemory.create({
            data: memoryData
          });
          
          console.log('成功保存到記憶，ID:', savedMemory.id);
        } catch (mongoError) {
          console.error('保存到記憶失敗:', mongoError);
        }
      }
      
      return savedMessage;
    } catch (error) {
      console.error('保存訊息失敗:', error);
      return null;
    }
  }
  
  /**
   * 通過對話 ID 獲取用戶 ID
   */
  private static async getUserIdByConversationId(conversationId: string): Promise<string> {
    try {
      const conversation = await mongoPrisma.mongoConversation.findUnique({
        where: { id: conversationId },
        select: { userId: true }
      });
      
      return conversation ? conversation.userId : '';
    } catch (error) {
      console.error('獲取用戶 ID 失敗:', error);
      return '';
    }
  }
  
  /**
   * 更新對話標題
   */
  public static async updateConversationTitle(conversationId: string, newTitle: string): Promise<boolean> {
    try {
      await mongoPrisma.mongoConversation.update({
        where: { id: conversationId },
        data: { title: newTitle }
      });
      
      return true;
    } catch (error) {
      console.error('更新對話標題失敗:', error);
      return false;
    }
  }
  
  /**
   * 刪除對話
   */
  public static async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      // 先刪除對話中的所有訊息
      await mongoPrisma.mongoMessage.deleteMany({
        where: { conversationId }
      });
      
      // 然後刪除對話本身
      await mongoPrisma.mongoConversation.delete({
        where: { id: conversationId }
      });
      
      return true;
    } catch (error) {
      console.error('刪除對話失敗:', error);
      return false;
    }
  }
  
  /**
   * 從對話的第一條消息生成標題
   */
  public static generateConversationTitle(firstMessage: string): string {
    const words = firstMessage.split(' ');
    return words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
  }
  
  /**
   * 獲取當前用戶
   */
  public static async getCurrentUser() {
    try {
      const session = await getServerSession(authOptions);
      return session?.user;
    } catch (error) {
      console.error('獲取用戶失敗:', error);
      return null;
    }
  }

  /**
   * 獲取用戶的記憶
   */
  public static async getUserMemories(userId: string, limit: number = 10): Promise<any[]> {
    try {
      const memories = await mongoPrisma.mongoMemory.findMany({
        where: { userId },
        orderBy: { importance: 'desc' },
        take: limit
      });
      
      return memories;
    } catch (error) {
      console.error('獲取用戶記憶失敗:', error);
      return [];
    }
  }
  
  /**
   * 測試 MongoDB 連接
   */
  public static async testMongoConnection(): Promise<boolean> {
    try {
      // 嘗試進行簡單的查詢來測試連接
      const count = await mongoPrisma.mongoMemory.count();
      console.log('MongoDB 記憶集合項目數量:', count);
      return true;
    } catch (error) {
      console.error('MongoDB 連接測試失敗:', error);
      return false;
    }
  }
}
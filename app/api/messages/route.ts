import { NextRequest, NextResponse } from 'next/server';
import { mongoPrisma } from '@/lib/mongoPrisma';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/utils/auth';

// 獲取對話訊息
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: '未授權訪問' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return new NextResponse(JSON.stringify({ error: '缺少對話 ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 檢查對話是否存在，以及是否屬於當前用戶
    const conversation = await mongoPrisma.mongoConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return new NextResponse(JSON.stringify({ error: '對話不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (conversation.userId !== session.user.id) {
      return new NextResponse(JSON.stringify({ error: '無權訪問此對話的訊息' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 獲取對話的所有訊息
    const messages = await mongoPrisma.mongoMessage.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' },
    });

    return new NextResponse(JSON.stringify({ messages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('獲取訊息失敗:', error);
    return new NextResponse(JSON.stringify({ error: '獲取訊息失敗' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 保存訊息
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: '未授權訪問' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();
    const { message, conversationId } = data;

    if (!message || !conversationId) {
      return new NextResponse(JSON.stringify({ error: '缺少必要參數' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 檢查對話是否存在，以及是否屬於當前用戶
    const conversation = await mongoPrisma.mongoConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return new NextResponse(JSON.stringify({ error: '對話不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (conversation.userId !== session.user.id) {
      return new NextResponse(JSON.stringify({ error: '無權在此對話中添加訊息' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 保存訊息
    const savedMessage = await mongoPrisma.mongoMessage.create({
      data: {
        id: message.id || `msg-${Date.now()}`,
        role: message.role,
        content: message.content,
        timestamp: message.timestamp || new Date(),
        model: message.model,
        conversationId,
      }
    });

    // 更新對話的最後更新時間
    await mongoPrisma.mongoConversation.update({
      where: { id: conversationId },
      data: { lastUpdated: new Date() }
    });

    // 如果是助手訊息，還可以添加到記憶
    if (message.role === 'assistant') {
      try {
        await mongoPrisma.mongoMemory.create({
          data: {
            userId: conversation.userId,
            content: message.content,
            type: 'CONVERSATION',
            importance: 5, // 預設中等重要性
            metadata: {
              conversationId,
              messageId: savedMessage.id,
              timestamp: savedMessage.timestamp,
              model: savedMessage.model
            }
          }
        });
      } catch (memoryError) {
        console.error('保存到記憶失敗:', memoryError);
        // 繼續流程，不影響主要功能
      }
    }

    return new NextResponse(JSON.stringify({ message: savedMessage }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('保存訊息失敗:', error);
    return new NextResponse(JSON.stringify({ error: '保存訊息失敗' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
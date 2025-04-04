import { NextRequest, NextResponse } from 'next/server';
import { mongoPrisma } from '@/lib/mongoPrisma';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/utils/auth';

// 獲取對話列表或特定對話
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
    const userId = searchParams.get('userId');
    const conversationId = searchParams.get('id');

    // 獲取特定對話
    if (conversationId) {
      const conversation = await mongoPrisma.mongoConversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        return new NextResponse(JSON.stringify({ error: '對話不存在' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 檢查是否是用戶自己的對話
      if (conversation.userId !== session.user.id) {
        return new NextResponse(JSON.stringify({ error: '無權訪問此對話' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new NextResponse(JSON.stringify({ conversation }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 獲取用戶的所有對話
    if (userId) {
      // 檢查是否是用戶自己的對話
      if (userId !== session.user.id) {
        return new NextResponse(JSON.stringify({ error: '無權訪問其他用戶的對話' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const conversations = await mongoPrisma.mongoConversation.findMany({
        where: { userId },
        orderBy: { lastUpdated: 'desc' },
      });

      return new NextResponse(JSON.stringify({ conversations }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new NextResponse(JSON.stringify({ error: '缺少必要參數' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('獲取對話失敗:', error);
    return new NextResponse(JSON.stringify({ error: '獲取對話失敗' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 創建新對話
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
    const { userId, title, modelId } = data;

    // 檢查是否是用戶自己
    if (userId !== session.user.id) {
      return new NextResponse(JSON.stringify({ error: '無權為其他用戶創建對話' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 創建新對話
    const conversationId = `conv-${Date.now()}`;
    const conversation = await mongoPrisma.mongoConversation.create({
      data: {
        id: conversationId,
        title: title || 'MiMi',
        modelId: modelId || 'gemini',
        lastUpdated: new Date(),
        userId,
      }
    });

    return new NextResponse(JSON.stringify({ conversation }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('創建對話失敗:', error);
    return new NextResponse(JSON.stringify({ error: '創建對話失敗' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 更新對話
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: '未授權訪問' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();
    const { id, title } = data;

    // 檢查對話是否存在
    const conversation = await mongoPrisma.mongoConversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      return new NextResponse(JSON.stringify({ error: '對話不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 檢查是否是用戶自己的對話
    if (conversation.userId !== session.user.id) {
      return new NextResponse(JSON.stringify({ error: '無權更新此對話' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 更新對話
    const updatedConversation = await mongoPrisma.mongoConversation.update({
      where: { id },
      data: {
        title,
        lastUpdated: new Date(),
      }
    });

    return new NextResponse(JSON.stringify({ conversation: updatedConversation }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('更新對話失敗:', error);
    return new NextResponse(JSON.stringify({ error: '更新對話失敗' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 刪除對話
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: '未授權訪問' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('id');

    if (!conversationId) {
      return new NextResponse(JSON.stringify({ error: '缺少對話 ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 檢查對話是否存在
    const conversation = await mongoPrisma.mongoConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return new NextResponse(JSON.stringify({ error: '對話不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 檢查是否是用戶自己的對話
    if (conversation.userId !== session.user.id) {
      return new NextResponse(JSON.stringify({ error: '無權刪除此對話' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 先刪除對話中的所有訊息
    await mongoPrisma.mongoMessage.deleteMany({
      where: { conversationId },
    });

    // 然後刪除對話本身
    await mongoPrisma.mongoConversation.delete({
      where: { id: conversationId },
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('刪除對話失敗:', error);
    return new NextResponse(JSON.stringify({ error: '刪除對話失敗' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
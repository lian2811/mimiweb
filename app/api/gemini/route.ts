import { NextRequest, NextResponse } from 'next/server';
import { initializeGemini, createAIChat } from '@/utils/gemini';

// 定義不同模型的系統提示詞
const MODEL_SYSTEM_PROMPTS = {
  gemini: `You are an AI assistant named Mimi, designed to be helpful, creative, and informative.
  You respond in a friendly and conversational tone. You can help with a wide range of tasks,
  from answering questions to generating creative content. Always be respectful and attempt to
  provide accurate information. When unsure, be honest about your limitations.`
  // 可以在這裡加入其他模型的系統提示詞
};

/**
 * POST 方法處理 - 處理 Gemini 文字生成請求
 */
export async function POST(req: NextRequest) {
  try {
    // 解析請求內容
    const body = await req.json();
    const { messages, systemPrompt } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // 初始化 Gemini API
    const ai = initializeGemini();
    
    // 格式化聊天歷史 (除了最後一條消息)
    const formattedHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // 獲取最後一條用戶消息
    const lastMessage = messages[messages.length - 1];

    // 確定使用的系統提示詞
    // 優先使用請求中提供的自定義系統提示詞，如果沒有則使用默認的
    const effectiveSystemPrompt = systemPrompt || MODEL_SYSTEM_PROMPTS.gemini;
    
    // 創建聊天會話（帶有系統提示詞）
    const chat = createAIChat(ai, formattedHistory, effectiveSystemPrompt);

    // 發送消息並獲取回覆
    const result = await chat.sendMessage({
      message: lastMessage.content,
    });

    // 提取回覆文本
    let responseText = "";
    
    if (result.response && result.response.parts) {
      responseText = result.response.parts
        .map((part: any) => part.text || '')
        .join('');
    } else if (result.text) {
      responseText = result.text;
    } else {
      responseText = "I'm sorry, I couldn't generate a response at this time.";
    }

    // 返回回覆
    return NextResponse.json({ 
      message: responseText, 
      content: responseText 
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
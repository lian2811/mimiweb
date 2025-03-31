import { 
  initializeGemini, 
  createAIChat, 
} from '@/utils/gemini';
import { 
  getOrCreateConversation, 
  addMessageToConversation,
  getFormattedHistory,
  storeChartDataInConversation
} from '@/utils/conversationStore';
import {
  generateChart,
} from '@/utils/ziwei';

// 导入或定义 GenderName 类型，与 ziwei.ts 中的类型保持一致
type GenderName = '男' | '女';


/**
 * 处理函数调用并返回结果
 */
const getFunctionResponse = (functionName: string | undefined, args: any, conversationId: string) => {
  if (!functionName) {
    return { result: "未知的函數調用。" };
  }
  
  switch (functionName) {
    case "generate_chart": {
      // 确保所需参数存在并设置默认值
      // 使用明确的类型转换确保参数类型正确
      const gender: GenderName = args.gender === '男' ? '男' : '女';
      const calendar_type: 'solar' | 'lunar' = args.calendar_type === 'lunar' ? 'lunar' : 'solar';
      
      // 地支时辰映射表：将传入的小时(0-23)转换成地支(0-12)
      const hourToChineseHour = (hour: number): number => {
        if (hour >= 23 || hour < 1) return 12; // 晚子时 (23:00-1:00)
        if (hour >= 1 && hour < 3) return 1;   // 丑时 (1:00-3:00)
        if (hour >= 3 && hour < 5) return 2;   // 寅时 (3:00-5:00)
        if (hour >= 5 && hour < 7) return 3;   // 卯时 (5:00-7:00)
        if (hour >= 7 && hour < 9) return 4;   // 辰时 (7:00-9:00)
        if (hour >= 9 && hour < 11) return 5;  // 巳时 (9:00-11:00)
        if (hour >= 11 && hour < 13) return 6; // 午时 (11:00-13:00)
        if (hour >= 13 && hour < 15) return 7; // 未时 (13:00-15:00)
        if (hour >= 15 && hour < 17) return 8; // 申时 (15:00-17:00) 
        if (hour >= 17 && hour < 19) return 9; // 酉时 (17:00-19:00)
        if (hour >= 19 && hour < 21) return 10; // 戌时 (19:00-21:00)
        return 11; // 亥时 (21:00-23:00)
      };
      
      // 处理 birth_hour
      let birth_hour: number;
      if (typeof args.birth_hour === 'number') {
        birth_hour = hourToChineseHour(args.birth_hour);
      } else {
        // 尝试将字符串转为数字
        const parsedHour = Number(args.birth_hour) || 0;
        birth_hour = hourToChineseHour(parsedHour);
      }
      
      const validatedArgs = {
        birth_date: args.birth_date || '',
        birth_hour,  // 已转换为地支时辰 (0-12)
        gender,      // 已明确为 GenderName 类型
        calendar_type  // 已明确为 'solar' | 'lunar' 类型
      };
      
      // 检查必要参数
      if (!validatedArgs.birth_date) {
        return { result: "缺少出生日期，無法生成命盤。", error: true };
      }

      const result = generateChart(validatedArgs);
      
      // Store chart data in conversation history if valid
      if (!result.error && conversationId && result.chartData) {
        storeChartDataInConversation(conversationId, result.chartData);
      }

      return result;
    }
    case "explain_palace":
      return {
        result: `${args.palace_name}在紫微斗數中代表人生中的特定領域。這是模擬回應，實際解釋將更加詳細。`,
      };
    case "explain_star":
      return {
        result: `${args.star_name}星在紫微斗數中是重要的星曜之一，它代表了特定的性格特質和人生運勢。這是模擬回應，實際解釋將更加詳細。`,
      };
    default:
      return {
        result: "未知的函數調用。",
      };
  }
};

// ==========================================
// 主要 API 处理函数
// ==========================================

/**
 * 标准的 SSE 发送函数
 */
function sendSSEData(controller: ReadableStreamDefaultController, encoder: TextEncoder, data: any) {
  try {
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  } catch (err) {
    console.error("Error sending SSE data:", err);
    
    // 发送简化错误信息
    try {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    } catch (e) {
      console.error("Failed to send error message:", e);
    }
  }
}

/**
 * GET 方法处理 - 处理查询参数的请求和 SSE 连接
 */
export async function GET(req: Request) {
  try {
    // 从 URL 获取查询参数
    const url = new URL(req.url);
    const messageId = url.searchParams.get('messageId') || '';
    const conversationId = url.searchParams.get('conversationId') || '';
    const query = url.searchParams.get('query') || '';
    const chartInfo = url.searchParams.get('chartInfo') || '';
    
    // 获取或创建会话
    const { conversationId: newConversationId, conversation } = 
      getOrCreateConversation(conversationId);
    
    const encoder = new TextEncoder();
    
    // 如果有查询内容，则处理为消息
    try {
        // 初始化 Gemini API
        const ai = initializeGemini();
        
        // 格式化聊天 API 的历史记录
        const formattedHistory = getFormattedHistory(newConversationId);
        
        // 如果可用，在用户消息中包含已有命盘数据
        let userMessage = query;
        
        if (chartInfo) {
          try {
            // 解析从URL参数获取的命盘信息
            
            // 将命盘信息添加到会话状态中
            if (!conversation.chartData) {
                storeChartDataInConversation(newConversationId, chartInfo);
            }
            
            // 将命盘摘要添加到用户消息中，但不使用方括号包住系统消息，避免可能的解析问题
            userMessage = `${query}\n\n系統訊息: ${chartInfo}。請根據該命盤資料進行解讀。`;
          } catch (error) {
            console.error('Error parsing chartInfo:', error);
            // 如果解析失败，使用简单版本
            if (conversation.chartData) {
                userMessage = `${query}\n\n系統訊息: 使用者已有命盤資料，請根據該資料進行解讀。`;
            }
          }
        } else if (conversation.chartData) {
          // 如果没有传入新的命盘数据但对话中已有命盘数据
          userMessage = `${query}\n\n系統訊息: 使用者已有命盤資料，請根據該資料進行解讀。`;
        }
        console.log("User message:", userMessage);
        // 创建AI聊天实例
        const chat = createAIChat(ai, formattedHistory);
        
        // 将用户消息添加到历史记录
        addMessageToConversation(newConversationId, "user", [{ text: userMessage }]);
        
        // 使用 SSE 返回流式响应
        const responseStream = new ReadableStream({
        async start(controller) {
            try {
                // 发送连接建立事件
                sendSSEData(controller, encoder, {
                    event: "connection_established",
                    conversation_id: newConversationId,
                    message_id: messageId || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                });

                // 使用流式传输发送消息
                const messageStream = await chat.sendMessageStream({
                    message: userMessage,
                });

                
                // 检查响应中的函数调用
                let fullResponse = '';
                let functionCallResponse = null;
                let hasFunctionCall = false;
                
                // 处理流式响应
                for await (const chunk of messageStream) {
                    // 处理函数调用
                    if (chunk.functionCalls && chunk.functionCalls.length > 0 && !hasFunctionCall) {
                        hasFunctionCall = true;
                        const functionCall = chunk.functionCalls[0];
                        const functionName = functionCall?.name;
                        const args = typeof functionCall?.args === 'string' 
                            ? JSON.parse(functionCall.args) 
                            : functionCall?.args ?? {};
                        
                        // 发送函数调用事件
                        sendSSEData(controller, encoder, {
                            event: "function_calling",
                            function_name: functionName,
                            conversation_id: newConversationId,
                        });
                        
                        // 获取函数响应
                        functionCallResponse = getFunctionResponse(functionName, args, newConversationId);

                        // 处理命盘数据更新
                        if (functionName === "generate_chart" && functionCallResponse && 'chartData' in functionCallResponse) {
 
                            // 发送命盘数据给客户端
                            sendSSEData(controller, encoder, {
                                event: "chart_update",
                                chartData: functionCallResponse.chartData,
                                conversation_id: newConversationId
                            });
                        }
                        
                        // 构建函数响应消息，确保AI能理解命盘数据
                        let functionResponseMessage = "";
                        if (functionName === "generate_chart" && functionCallResponse) {
                            // 使用命盘的summary对象提供更丰富的上下文信息
                            // @ts-expect-error - 忽略类型检查，因为我们知道generateChart返回的结果中有summary属性
                            const summary = functionCallResponse.summary || {};
                            let summaryText = "";
                            // 如果有主星信息，添加到摘要中
                            if (summary.main_stars && Array.isArray(summary.main_stars) && summary.main_stars.length > 0) {
                                summaryText += `\n主要宮位星曜:\n${summary.main_stars.filter(Boolean).join('\n')}`;
                            }
                            
                            // 创建更详细的响应信息，包含命盘摘要
                            functionResponseMessage = `[系統資訊: 這是獲取的使用者命盤數據:${functionCallResponse.result}\n${summaryText}\n]\n`;
                        } else {
                            functionResponseMessage = JSON.stringify(functionCallResponse);
                        }
                        console.log("Function response message:", functionResponseMessage);
                        // 发送函数响应回模型，带上命盘数据内容
                        const followupStream = await chat.sendMessageStream({
                            message: functionResponseMessage
                        });

                        // 流式处理此响应
                        for await (const followupChunk of followupStream) {
                            if (followupChunk.text) {
                            fullResponse += followupChunk.text;
                            // 向客户端发送每个块
                            sendSSEData(controller, encoder, {
                                event: "message_token",
                                message_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                                conversation_id: newConversationId,
                                content: followupChunk.text,
                            });
                            }
                        }
                        
                        // 将响应保存到历史记录
                        addMessageToConversation(newConversationId, "model", [{ text: fullResponse }]);
                        
                        // 发送消息结束事件
                        sendSSEData(controller, encoder, {
                            event: "message_end",
                            message_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                            conversation_id: newConversationId,
                            function_call: functionCallResponse ? {
                            name: functionName,
                            // 简化参数以避免过大的数据包
                            arguments: args ? { ...args, simplified: true } : args,
                            // 不在消息结束事件中包含完整响应，避免重复发送大量数据
                            response: { success: true, message: "Function called successfully" }
                            } : null
                        });
                        
                        break;
                    } else if (chunk.text) {
                        
                        // 处理常规文本响应
                        fullResponse += chunk.text;
                        // 流式传输块
                        sendSSEData(controller, encoder, {
                            event: "message_token",
                            message_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                            conversation_id: newConversationId,
                            content: chunk.text,
                        });
                    }
                }
            
                // 如果没有函数调用，完成常规文本响应
                if (!hasFunctionCall) {
                    // 将响应保存到历史记录
                    addMessageToConversation(newConversationId, "model", [{ text: fullResponse }]);
                    // 发送消息结束事件
                    sendSSEData(controller, encoder, {
                    event: "message_end",
                    message_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    conversation_id: newConversationId,
                    });
                }
            } catch (error) {
                console.error("Error in streaming:", error);
                sendSSEData(controller, encoder, {
                    event: "error",
                    error: error instanceof Error ? error.message : "Error in streaming response"
                });

            } finally {
            // 无论如何都尝试关闭控制器
            try {
                controller.close();
            } catch (closeError) {
                console.error("Failed to close controller, may already be closed:", closeError);
            }
            }
        }
        });
        
        return new Response(responseStream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
        });
    } catch (error: any) {
        console.error("Error in handling query:", error);
        return new Response(
        `data: ${JSON.stringify({
            event: "error",
            error: error.message || "An error occurred while processing your request"
        })}\n\n`,
        {
            headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            },
            status: 500
        }
        );
    }

  } catch (error: any) {
    console.error("Error in GET request:", error);
    // 即使发生错误也返回SSE格式的错误响应
    return new Response(
      `data: ${JSON.stringify({
        event: "error",
        error: error.message || "An error occurred while processing your request"
      })}\n\n`,
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
        status: 500
      }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createIntegratedMcpServer } from '@/utils/mcp/mcpIntegration';
import { createSSETransport, sseTransports } from '@/utils/mcp/mcpServer';
import { initializeOpenAI } from '@/utils/mcp/openai';

// Create the server once
const mcpServer = createIntegratedMcpServer();

/**
 * Handles SSE connections for MCP
 * This establishes a persistent connection with the client
 */
export async function GET(req: NextRequest) {
  // 獲取 sessionId 參數或生成新的
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('sessionId') || Math.random().toString(36).substring(2, 15);
  
  // 設置 SSE 響應
  const response = new NextResponse(new ReadableStream({
    start(controller) {
      // 發送初始連接信息
      controller.enqueue(new TextEncoder().encode('event: connected\ndata: {"status":"connected","sessionId":"' + sessionId + '"}\n\n'));
      
      // 創建並註冊 transport
      const transport = createSSETransport(controller);
      sseTransports[sessionId] = transport;
      
      // 連接 transport 到伺服器
      try {
        mcpServer.connect(transport)
          .then(() => {
            console.log(`MCP transport ${sessionId} connected successfully`);
          })
          .catch((error) => {
            console.error('Error connecting MCP transport:', error);
            controller.enqueue(new TextEncoder().encode(`event: error\ndata: {"error":"${error.message}"}\n\n`));
          });
      } catch (error: any) {
        console.error('Exception during MCP transport connection:', error);
        controller.enqueue(new TextEncoder().encode(`event: error\ndata: {"error":"${error.message}"}\n\n`));
      }
    }
  }), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    }
  });
  
  return response;
}

/**
 * Handles incoming MCP client messages
 * This routes messages to the appropriate transport
 */
export async function POST(req: NextRequest) {
  try {
    // Get the session ID from the query parameter
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'No sessionId provided' }, { status: 400 });
    }
    
    // Find the transport for this session
    const transport = sseTransports[sessionId];
    if (!transport) {
      return NextResponse.json({ error: 'Invalid sessionId or session expired' }, { status: 404 });
    }
    
    // Parse and process the message
    const message = await req.json();
    
    // 直接調用我們自己實現的 handleMessage 方法
    const result = await transport.handleMessage(message);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error processing MCP message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
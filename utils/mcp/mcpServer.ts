import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

/**
 * Creates and configures the MCP server
 * This is the main entry point for the MCP backend
 */
export function createMcpServer() {
  const server = new McpServer({
    name: "MimiAI", 
    version: "1.0.0",
    description: "MimiAI MCP Server providing access to various AI models and data sources"
  });

  // Register server resources, tools, and prompts
  registerResources(server);
  registerTools(server);
  registerPrompts(server);

  return server;
}

/**
 * Register server resources 
 * Resources are like GET endpoints - they provide data to the LLM but don't have side effects
 */
function registerResources(server: McpServer) {
  // User profile resource
  server.resource(
    "user-profile",
    new ResourceTemplate("user-profile://{userId}", { list: undefined }),
    async (uri, params) => {
      // Handle string array parameters
      const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
      
      // Here you would fetch the user profile from your database
      // This is just a placeholder implementation
      return {
        contents: [{
          uri: uri.href,
          text: `User profile for user ${userId}`,
          metadata: {
            contentType: "text/plain"
          }
        }]
      };
    }
  );

  // Conversation history resource
  server.resource(
    "conversation-history",
    new ResourceTemplate("conversation-history://{conversationId}", { list: undefined }),
    async (uri, params) => {
      // Handle string array parameters
      const conversationId = Array.isArray(params.conversationId) ? params.conversationId[0] : params.conversationId;
      
      // Here you would fetch conversation history from your database
      // This is just a placeholder implementation
      return {
        contents: [{
          uri: uri.href,
          text: `Conversation history for conversation ${conversationId}`,
          metadata: {
            contentType: "text/plain"
          }
        }]
      };
    }
  );

  // Ziwei chart resource
  server.resource(
    "ziwei-chart",
    new ResourceTemplate("ziwei-chart://{chartId}", { list: undefined }),
    async (uri, params) => {
      // Handle string array parameters
      const chartId = Array.isArray(params.chartId) ? params.chartId[0] : params.chartId;
      
      // Here you would fetch Ziwei chart data
      // This is just a placeholder implementation
      return {
        contents: [{
          uri: uri.href,
          text: `Ziwei chart data for chart ${chartId}`,
          metadata: {
            contentType: "application/json"
          }
        }]
      };
    }
  );
}

/**
 * Register server tools
 * Tools are like POST endpoints - they perform actions or computations
 */
function registerTools(server: McpServer) {
  // Chat completion tool
  server.tool(
    "chat-completion",
    {
      model: z.string().optional(),
      messages: z.array(
        z.object({
          role: z.enum(["user", "assistant", "system"]),
          content: z.string()
        })
      ),
      temperature: z.number().optional(),
      max_tokens: z.number().optional()
    },
    async (params) => {
      // This would call the appropriate model based on the parameters
      // We'll implement model integration in separate files
      return {
        content: [{ type: "text", text: "AI response placeholder" }]
      };
    }
  );

  // Generate Ziwei chart tool
  server.tool(
    "generate-ziwei-chart",
    {
      birth_date: z.string(),
      birth_hour: z.number(),
      gender: z.enum(["男", "女"]).optional(),
      calendar_type: z.enum(["solar", "lunar"]).optional(),
    },
    async (params) => {
      // Here you would call your Ziwei chart generation logic
      return {
        content: [{ 
          type: "text", 
          text: `Generated Ziwei chart for ${params.birth_date} at hour ${params.birth_hour}` 
        }]
      };
    }
  );

  // Database query tool
  server.tool(
    "query-database",
    {
      query: z.string(),
      database: z.string()
    },
    async (params) => {
      // Here you would safely query your database based on parameters
      return {
        content: [{ 
          type: "text", 
          text: `Query results from ${params.database}: [Results would appear here]` 
        }]
      };
    }
  );
}

/**
 * Register server prompts
 * Prompts are reusable templates for LLM interactions
 */
function registerPrompts(server: McpServer) {
  // Ziwei analysis prompt
  server.prompt(
    "ziwei-analysis",
    "Analyzes Ziwei chart data with optional focus area",
    (extra) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please analyze Ziwei chart data.`
        }
      }]
    })
  );

  // Define the schema separately for use with typed prompt
  const ziweiAnalysisSchema = {
    chart_data: z.string(),
    analysis_focus: z.string().optional()
  };

  // Register the typed version of the prompt
  server.prompt(
    "ziwei-analysis-typed",
    ziweiAnalysisSchema,
    (args) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please analyze this Ziwei chart data: ${args.chart_data}${args.analysis_focus ? `\nFocus on: ${args.analysis_focus}` : ""}`
        }
      }]
    })
  );

  // General chat prompt
  server.prompt(
    "general-chat",
    "General chat with MimiAI assistant",
    (extra) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: "Hello, how can you help me today?"
        }
      }]
    })
  );

  // Typed general chat prompt
  const generalChatSchema = {
    user_message: z.string(),
    user_name: z.string().optional()
  };

  server.prompt(
    "general-chat-typed",
    generalChatSchema,
    (args) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: args.user_message
        }
      }]
    })
  );
}

/**
 * Configure and start an MCP server with stdio transport
 * Useful for command-line integration
 */
export async function startStdioMcpServer() {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  return { server, transport };
}

/**
 * Configure transports for HTTP-based MCP server with SSE
 * This is used for web applications to connect to the MCP server
 */
export function createSSETransport(controller: ReadableStreamDefaultController) {
  const sessionId = Math.random().toString(36).substring(2, 15); // Generate a unique session ID
  
  return {
    sessionId,
    // 實現 MCP transport 介面所需方法
    start: () => {
      // 連接建立時的處理邏輯
      console.log(`Transport ${sessionId} started`);
      return Promise.resolve();
    },
    
    // 修改 send 方法以接受 JSONRPCMessage 類型
    send: async (message: any) => {
      try {
        // 將 JSONRPCMessage 轉換為字串
        const messageString = JSON.stringify(message);
        // 發送 SSE 事件
        controller.enqueue(new TextEncoder().encode(`data: ${messageString}\n\n`));
      } catch (error) {
        console.error(`Error sending message on transport ${sessionId}:`, error);
      }
      return Promise.resolve();
    },
    
    close: () => {
      console.log(`Transport ${sessionId} closed`);
      controller.close();
      return Promise.resolve();
    },
    
    // 處理從客戶端收到的消息
    handleMessage: async (message: any) => {
      console.log(`Received message on transport ${sessionId}:`, message);
      // 在實際情況中，這裡應該將消息轉發到 MCP 伺服器
      // 並返回處理結果
      return { success: true, result: { content: [{ type: "text", text: "Message received" }] } };
    }
  };
}

/**
 * Store for SSE transports
 * This helps manage multiple simultaneous connections
 */
export const sseTransports: { [sessionId: string]: ReturnType<typeof createSSETransport> } = {};
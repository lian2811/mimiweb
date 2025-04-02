// Export all MCP-related functionality from a single entry point
export * from './mcpServer';
export * from './mcpIntegration';
export * from './openai';
export * from './database';

// Re-export the core functionality for convenience
import { createIntegratedMcpServer } from './mcpIntegration';
import { startStdioMcpServer, createSSETransport, sseTransports } from './mcpServer';
import { initializeOpenAI, handleChatConversation } from './openai';

/**
 * Default export for easy importing in Next.js pages
 */
export default {
  createIntegratedMcpServer,
  startStdioMcpServer,
  createSSETransport,
  sseTransports,
  initializeOpenAI,
  handleChatConversation
};
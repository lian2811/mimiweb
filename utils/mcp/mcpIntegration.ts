import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { initializeOpenAI, handleChatConversation, ziweiAIFunctionsOpenAI, getSystemInstructionText } from './openai';
import * as dbUtils from './database';
import { z } from "zod";
import { Document } from '@langchain/core/documents';

/**
 * Enhances the MCP server with LangChain and model integrations
 * This function adds additional resources and tools beyond the basic setup
 * @param server The MCP server instance to enhance
 */
export function enhanceMcpServer(server: McpServer): void {
  // Register enhanced resources
  registerEnhancedResources(server);
  
  // Register enhanced tools
  registerEnhancedTools(server);
  
  // Register enhanced prompts
  registerEnhancedPrompts(server);
}

/**
 * Registers enhanced resources that connect to databases and external sources
 * @param server The MCP server instance
 */
function registerEnhancedResources(server: McpServer): void {
  // MongoDB document resource
  server.resource(
    "mongodb-document",
    new ResourceTemplate("mongodb://{database}/{collection}/{documentId}", { list: undefined }),
    async (uri, params) => {
      try {
        // Get database parameter, ensuring it's a string
        const database = Array.isArray(params.database) ? params.database[0] : params.database;
        
        // Get collection parameter, ensuring it's a string
        const collection = Array.isArray(params.collection) ? params.collection[0] : params.collection;
        
        // Get documentId parameter, ensuring it's a string
        const documentId = Array.isArray(params.documentId) ? params.documentId[0] : params.documentId;
        
        // This would use actual connection params from env or config
        const db = await dbUtils.initializeMongoDB(
          process.env.MONGODB_URI || 'mongodb://localhost:27017',
          database
        );
        
        // Convert the documentId to an ObjectId if it's a valid format, or use as string
        let docId;
        try {
          // Try to convert to ObjectId if it's a valid format
          const { ObjectId } = require('mongodb');
          if (ObjectId.isValid(documentId)) {
            docId = new ObjectId(documentId);
          } else {
            docId = documentId;
          }
        } catch (error) {
          // If ObjectId conversion fails, use the string as is
          docId = documentId;
        }
        
        const doc = await db.collection(collection).findOne({ _id: docId });
        
        if (!doc) {
          return {
            contents: [{
              uri: uri.href,
              text: `Document not found: ${documentId}`,
              metadata: { contentType: "text/plain" }
            }]
          };
        }
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(doc, null, 2),
            metadata: { contentType: "application/json" }
          }]
        };
      } catch (error: any) {
        return {
          contents: [{
            uri: uri.href,
            text: `Error retrieving document: ${error.message}`,
            metadata: { contentType: "text/plain" }
          }]
        };
      }
    }
  );

  // SQL table data resource
  server.resource(
    "sql-table",
    new ResourceTemplate("sql://{dbType}/{database}/{table}?{query}", { list: undefined }),
    async (uri, params) => {
      try {
        // Ensure all params are strings, not arrays
        const dbType = Array.isArray(params.dbType) ? params.dbType[0] : params.dbType;
        const database = Array.isArray(params.database) ? params.database[0] : params.database;
        const table = Array.isArray(params.table) ? params.table[0] : params.table;
        const query = Array.isArray(params.query) ? params.query[0] : params.query;
        
        // This would use actual connection params from env or config
        const db = await dbUtils.initializeSQLDatabase(
          dbType as 'mysql' | 'postgres' | 'sqlite',
          {
            database: database,
            // Add other connection params as needed
          }
        );
        
        const sqlQuery = query ? 
          decodeURIComponent(query) : 
          `SELECT * FROM ${table} LIMIT 10`;
          
        const result = await dbUtils.executeSQLQuery(db, sqlQuery);
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(result, null, 2),
            metadata: { contentType: "application/json" }
          }]
        };
      } catch (error: any) {
        return {
          contents: [{
            uri: uri.href,
            text: `Error querying SQL database: ${error.message}`,
            metadata: { contentType: "text/plain" }
          }]
        };
      }
    }
  );

  // Vector search resource
  server.resource(
    "vector-search",
    new ResourceTemplate("vector://{collection}?query={query}&k={k}", { list: undefined }),
    async (uri, params) => {
      try {
        // Ensure all params are strings, not arrays
        const collection = Array.isArray(params.collection) ? params.collection[0] : params.collection;
        const query = Array.isArray(params.query) ? params.query[0] : params.query;
        const k = Array.isArray(params.k) ? params.k[0] : params.k;
        
        // This would use actual connection params from env or config
        const db = await dbUtils.initializeMongoDB(
          process.env.MONGODB_URI || 'mongodb://localhost:27017',
          'vector_db'
        );
        
        const mongoCollection = db.collection(collection);
        const vectorStore = await dbUtils.createVectorStore(mongoCollection);
        
        const results = await dbUtils.semanticSearch(
          vectorStore, 
          decodeURIComponent(query), 
          k ? Number(k) : 5
        );
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(results.map(doc => ({
              content: doc.pageContent,
              metadata: doc.metadata
            })), null, 2),
            metadata: { contentType: "application/json" }
          }]
        };
      } catch (error: any) {
        return {
          contents: [{
            uri: uri.href,
            text: `Error during vector search: ${error.message}`,
            metadata: { contentType: "text/plain" }
          }]
        };
      }
    }
  );

  // Neo4j graph database resource
  server.resource(
    "graph-database",
    new ResourceTemplate("graph://{database}?{query}", { list: undefined }),
    async (uri, params) => {
      try {
        // Ensure all params are strings, not arrays
        const database = Array.isArray(params.database) ? params.database[0] : params.database;
        const query = Array.isArray(params.query) ? params.query[0] : params.query;
        
        // Connect to Neo4j
        const driver = await dbUtils.initializeNeo4j(
          process.env.NEO4J_URI || 'neo4j://localhost:7687',
          process.env.NEO4J_USER || 'neo4j',
          process.env.NEO4J_PASSWORD || 'password',
          database
        );
        
        // Execute query if provided
        if (query) {
          const decodedQuery = decodeURIComponent(query);
          const result = await dbUtils.runCypherQuery(driver, decodedQuery);
          
          return {
            contents: [{
              uri: uri.href,
              text: JSON.stringify(result, null, 2),
              metadata: { contentType: "application/json" }
            }]
          };
        } else {
          // Return database schema instead
          const schema = await dbUtils.getGraphSchema(driver);
          
          return {
            contents: [{
              uri: uri.href,
              text: JSON.stringify(schema, null, 2),
              metadata: { contentType: "application/json" }
            }]
          };
        }
      } catch (error: any) {
        return {
          contents: [{
            uri: uri.href,
            text: `Error accessing graph database: ${error.message}`,
            metadata: { contentType: "text/plain" }
          }]
        };
      }
    }
  );

  // Hybrid search resource (vector + graph)
  server.resource(
    "hybrid-search",
    new ResourceTemplate("hybrid://{vectorCollection}/{graphDatabase}?query={query}&depth={depth}&k={k}", { list: undefined }),
    async (uri, params) => {
      try {
        // Ensure all params are strings, not arrays
        const vectorCollection = Array.isArray(params.vectorCollection) ? params.vectorCollection[0] : params.vectorCollection;
        const graphDatabase = Array.isArray(params.graphDatabase) ? params.graphDatabase[0] : params.graphDatabase;
        const query = Array.isArray(params.query) ? params.query[0] : params.query;
        const depth = Array.isArray(params.depth) ? params.depth[0] : params.depth;
        const k = Array.isArray(params.k) ? params.k[0] : params.k;
        
        if (!query) {
          return {
            contents: [{
              uri: uri.href,
              text: "Error: query parameter is required",
              metadata: { contentType: "text/plain" }
            }]
          };
        }
        
        // Connect to MongoDB for vector search
        const db = await dbUtils.initializeMongoDB(
          process.env.MONGODB_URI || 'mongodb://localhost:27017',
          'vector_db'
        );
        
        const mongoCollection = db.collection(vectorCollection);
        const vectorStore = await dbUtils.createVectorStore(mongoCollection);
        
        // Connect to Neo4j for graph traversal
        const graphDriver = await dbUtils.initializeNeo4j(
          process.env.NEO4J_URI || 'neo4j://localhost:7687',
          process.env.NEO4J_USER || 'neo4j',
          process.env.NEO4J_PASSWORD || 'password',
          graphDatabase
        );
        
        // Perform hybrid search
        const results = await dbUtils.hybridSearch(
          vectorStore,
          graphDriver,
          decodeURIComponent(query),
          {
            vectorK: k ? parseInt(k) : 5,
            graphRelationDepth: depth ? parseInt(depth) : 1
          }
        );
        
        return {
          contents: [{
            uri: uri.href,
            text: JSON.stringify(results.map(doc => ({
              content: doc.pageContent,
              metadata: doc.metadata
            })), null, 2),
            metadata: { contentType: "application/json" }
          }]
        };
      } catch (error: any) {
        return {
          contents: [{
            uri: uri.href,
            text: `Error during hybrid search: ${error.message}`,
            metadata: { contentType: "text/plain" }
          }]
        };
      }
    }
  );
}

/**
 * Registers enhanced tools that leverage LLMs and LangChain functionality
 * @param server The MCP server instance
 */
function registerEnhancedTools(server: McpServer): void {
  // OpenAI chat completion tool
  server.tool(
    "openai-chat",
    {
      messages: z.array(
        z.object({
          role: z.enum(["user", "assistant", "system"]),
          content: z.string()
        })
      ),
      model: z.string().optional(),
      temperature: z.number().optional(),
      max_tokens: z.number().optional(),
      use_functions: z.boolean().optional(),
    },
    async (params) => {
      try {
        const openai = initializeOpenAI();
        
        const options = {
          temperature: params.temperature,
          max_tokens: params.max_tokens,
          model: params.model,
          tools: params.use_functions ? ziweiAIFunctionsOpenAI : undefined
        };
        
        const response = await handleChatConversation(
          openai,
          params.messages,
          undefined, // No system instruction by default
          options
        );
        
        return {
          content: [{ 
            type: "text",
            text: response.choices[0].message.content || "No response content"
          }],
          metadata: {
            model: response.model,
            usage: response.usage
          }
        };
      } catch (error: any) {
        return {
          content: [{ 
            type: "text",
            text: `Error calling OpenAI: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Ziwei chat specialist tool
  server.tool(
    "ziwei-specialist-chat",
    {
      messages: z.array(
        z.object({
          role: z.enum(["user", "assistant", "system"]),
          content: z.string()
        })
      ),
      use_functions: z.boolean().optional(),
    },
    async (params) => {
      try {
        const openai = initializeOpenAI();
        
        // Clone the messages array
        const messages = [...params.messages];
        
        // Add the system instruction at the beginning
        messages.unshift({
          role: "system",
          content: getSystemInstructionText()
        });
        
        const options = {
          model: process.env.OPENAI_ZIWEI_MODEL || "gpt-4-turbo",
          temperature: 0.7,
          tools: params.use_functions ? ziweiAIFunctionsOpenAI : undefined
        };
        
        const response = await handleChatConversation(
          openai,
          messages,
          undefined, // System instruction already added
          options
        );
        
        return {
          content: [{ 
            type: "text",
            text: response.choices[0].message.content || "No response content" 
          }],
          metadata: {
            model: response.model,
            usage: response.usage
          }
        };
      } catch (error: any) {
        return {
          content: [{ 
            type: "text",
            text: `Error calling Ziwei specialist: ${error.message}` 
          }],
          isError: true
        };
      }
    }
  );

  // Document retrieval and QA tool using LangChain
  server.tool(
    "document-qa",
    {
      query: z.string(),
      collection: z.string(),
      k: z.number().optional()
    },
    async (params) => {
      try {
        // Connect to MongoDB
        const db = await dbUtils.initializeMongoDB(
          process.env.MONGODB_URI || 'mongodb://localhost:27017',
          'documents_db'
        );
        
        // Get collection and create vector store
        const mongoCollection = db.collection(params.collection);
        const vectorStore = await dbUtils.createVectorStore(mongoCollection);
        
        // Perform semantic search
        const k = params.k || 5;
        const results = await dbUtils.semanticSearch(vectorStore, params.query, k);
        
        // Use retrieved documents to answer the query
        const openai = initializeOpenAI();
        const context = results.map(doc => doc.pageContent).join("\n\n");
        
        const response = await handleChatConversation(
          openai,
          [{
            role: "system",
            content: `You are a helpful assistant. Use the following context to answer the user's question. 
            If you don't know the answer based on the context, say so.
            
            Context:
            ${context}`
          }, {
            role: "user",
            content: params.query
          }],
          undefined,
          { model: "gpt-4o" }
        );
        
        return {
          content: [{ 
            type: "text",
            text: response.choices[0].message.content || "No answer found" 
          }],
          metadata: {
            sources: results.map(doc => doc.metadata)
          }
        };
      } catch (error: any) {
        return {
          content: [{ 
            type: "text", 
            text: `Error performing document QA: ${error.message}` 
          }],
          isError: true
        };
      }
    }
  );

  // Graph database query tool
  server.tool(
    "graph-query",
    {
      cypher: z.string(),
      database: z.string().optional(),
      params: z.record(z.any()).optional()
    },
    async (params) => {
      try {
        // Connect to Neo4j
        const driver = await dbUtils.initializeNeo4j(
          process.env.NEO4J_URI || 'neo4j://localhost:7687',
          process.env.NEO4J_USER || 'neo4j',
          process.env.NEO4J_PASSWORD || 'password',
          params.database
        );
        
        // Execute the Cypher query
        const results = await dbUtils.runCypherQuery(
          driver, 
          params.cypher, 
          params.params || {}
        );
        
        return {
          content: [{ 
            type: "text",
            text: JSON.stringify(results, null, 2)
          }],
          metadata: {
            recordCount: results.length
          }
        };
      } catch (error: any) {
        return {
          content: [{ 
            type: "text",
            text: `Error executing Cypher query: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Hybrid RAG QA tool (combines vector search and graph database)
  server.tool(
    "hybrid-qa",
    {
      query: z.string(),
      vectorCollection: z.string(),
      graphDatabase: z.string(),
      graphDepth: z.number().optional(),
      vectorResults: z.number().optional(),
      nodeLabel: z.string().optional(),
      relationshipType: z.string().optional()
    },
    async (params) => {
      try {
        // Connect to MongoDB for vector storage
        const db = await dbUtils.initializeMongoDB(
          process.env.MONGODB_URI || 'mongodb://localhost:27017',
          'vector_db'
        );
        
        const mongoCollection = db.collection(params.vectorCollection);
        const vectorStore = await dbUtils.createVectorStore(mongoCollection);
        
        // Connect to Neo4j for graph database
        const graphDriver = await dbUtils.initializeNeo4j(
          process.env.NEO4J_URI || 'neo4j://localhost:7687',
          process.env.NEO4J_USER || 'neo4j',
          process.env.NEO4J_PASSWORD || 'password',
          params.graphDatabase
        );
        
        // Perform hybrid search
        const results = await dbUtils.hybridSearch(
          vectorStore,
          graphDriver,
          params.query,
          {
            vectorK: params.vectorResults || 5,
            graphRelationDepth: params.graphDepth || 1,
            nodeLabel: params.nodeLabel,
            relationshipType: params.relationshipType
          }
        );
        
        // Use retrieved documents (enriched with graph info) to answer the query
        const openai = initializeOpenAI();
        
        // Extract text from documents and add graph relation information
        const contextParts = results.map(doc => {
          let text = doc.pageContent;
          
          // Add graph relations if they exist
          if (doc.metadata.graphRelations && doc.metadata.graphRelations.length > 0) {
            text += "\n\nRelated information:";
            doc.metadata.graphRelations.forEach((relation: any) => {
              text += `\n- ${relation.relationType} to ${relation.nodeType}: ${JSON.stringify(relation.properties)}`;
            });
          }
          
          return text;
        });
        
        const context = contextParts.join("\n\n---\n\n");
        
        // Generate response with LLM
        const response = await handleChatConversation(
          openai,
          [{
            role: "system",
            content: `You are a helpful assistant. Use the following context to answer the user's question.
            The context includes both document content and graph relationship information.
            If you don't know the answer based on the context, say so.
            
            Context:
            ${context}`
          }, {
            role: "user",
            content: params.query
          }],
          undefined,
          { model: "gpt-4o" }
        );
        
        return {
          content: [{ 
            type: "text",
            text: response.choices[0].message.content || "No answer found"
          }],
          metadata: {
            sources: results.map(doc => ({
              id: doc.metadata._id || doc.metadata.id,
              hasGraphData: !!doc.metadata.graphRelations
            }))
          }
        };
      } catch (error: any) {
        return {
          content: [{ 
            type: "text",
            text: `Error performing hybrid question answering: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );
}

/**
 * Registers enhanced prompts that connect to databases and models
 * @param server The MCP server instance 
 */
function registerEnhancedPrompts(server: McpServer): void {
  // Ziwei consultation prompt - simple version
  server.prompt(
    "ziwei-consultation-simple",
    "Get a Ziwei chart consultation based on birth information",
    (extra) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: "Please analyze my Ziwei chart based on my birth information."
        }
      }]
    })
  );

  // Define schemas for the typed prompts
  const ziweiConsultationSchema = {
    birth_date: z.string(),
    birth_hour: z.string(), // Changed from number to string to match MCP requirements
    gender: z.string().optional(),
    calendar_type: z.string().optional(),
    question: z.string().optional()
  };

  // Ziwei consultation prompt - typed version
  server.prompt(
    "ziwei-consultation",
    ziweiConsultationSchema,
    (args) => {
      let prompt = `I was born on ${args.birth_date} at hour ${args.birth_hour}.`;
      
      if (args.gender) {
        prompt += ` I am ${args.gender}.`;
      }
      
      if (args.calendar_type) {
        prompt += ` This date is in the ${args.calendar_type} calendar.`;
      }
      
      if (args.question) {
        prompt += ` My question is: ${args.question}`;
      } else {
        prompt += ` Please analyze my Ziwei chart and provide insights about my life.`;
      }
      
      return {
        messages: [{
          role: "user",
          content: {
            type: "text",
            text: prompt
          }
        }]
      };
    }
  );

  // Database query prompt - simple version
  server.prompt(
    "database-query-simple",
    "Get information from a database with natural language query",
    (extra) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: "Please help me query a database."
        }
      }]
    })
  );

  // Database query prompt - typed version
  const databaseQuerySchema = {
    database_type: z.string(),
    database_name: z.string(),
    question: z.string()
  };

  server.prompt(
    "database-query",
    databaseQuerySchema,
    (args) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `I'm working with a ${args.database_type} database named ${args.database_name}. ${args.question}`
        }
      }]
    })
  );
}

/**
 * Creates an MCP server with all integrations configured
 * This is the main entry point for creating a fully integrated MCP server
 */
export function createIntegratedMcpServer(): McpServer {
  // Create the base MCP server
  const server = new McpServer({
    name: "MimiAI Integrated", 
    version: "1.0.0",
    description: "MimiAI MCP Server with full database and model integrations"
  });
  
  // Enhance it with integrations
  enhanceMcpServer(server);
  
  return server;
}
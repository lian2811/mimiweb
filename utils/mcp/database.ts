import { MongoClient, Db } from 'mongodb';
import { SqlDatabase } from 'langchain/sql_db';
import { DataSource } from 'typeorm';
import { Document } from '@langchain/core/documents';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { OpenAIEmbeddings } from '@langchain/openai';
import * as neo4j from 'neo4j-driver';
import { Redis } from 'ioredis';

// Configuration for database connections
interface DatabaseConfig {
  type: 'mongodb' | 'mysql' | 'postgres' | 'sqlite';
  connection: any;
  database?: string;
  collection?: string;
}

// Store database connections for reuse
const dbConnections: Record<string, any> = {};

// Neo4j connection store
const neo4jConnections: Record<string, neo4j.Driver> = {};

/**
 * Initialize a MongoDB connection
 * @param uri MongoDB connection URI
 * @param dbName Database name
 * @returns MongoDB database instance
 */
export async function initializeMongoDB(uri: string, dbName: string): Promise<Db> {
  const client = new MongoClient(uri);
  
  // Check if connection already exists
  const connectionKey = `mongodb:${uri}:${dbName}`;
  if (dbConnections[connectionKey]) {
    return dbConnections[connectionKey];
  }
  
  try {
    await client.connect();
    const db = client.db(dbName);
    
    // Store connection for reuse
    dbConnections[connectionKey] = db;
    
    return db;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw new Error(`Failed to connect to MongoDB: ${error}`);
  }
}

/**
 * Initialize a SQL database connection with LangChain
 * @param type Database type (mysql, postgres, sqlite)
 * @param config Database configuration
 * @returns LangChain SQL database instance
 */
export async function initializeSQLDatabase(
  type: 'mysql' | 'postgres' | 'sqlite',
  config: {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database: string;
    filename?: string; // For SQLite
  }
): Promise<SqlDatabase> {
  // Create TypeORM data source based on database type
  let dataSource: DataSource;
  
  switch(type) {
    case 'mysql':
      dataSource = new DataSource({
        type: 'mysql',
        host: config.host || 'localhost',
        port: config.port || 3306,
        username: config.user || 'root',
        password: config.password || '',
        database: config.database
      });
      break;
    
    case 'postgres':
      dataSource = new DataSource({
        type: 'postgres',
        host: config.host || 'localhost',
        port: config.port || 5432,
        username: config.user || 'postgres',
        password: config.password || '',
        database: config.database
      });
      break;
    
    case 'sqlite':
      dataSource = new DataSource({
        type: 'sqlite',
        database: config.filename || config.database
      });
      break;
    
    default:
      throw new Error(`Unsupported database type: ${type}`);
  }
  
  // Check if connection already exists
  const connectionKey = `${type}:${config.host || 'local'}:${config.database}`;
  if (dbConnections[connectionKey]) {
    return dbConnections[connectionKey];
  }
  
  try {
    // Initialize the database
    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: dataSource,
      includesTables: [], // Include all tables by default
    });
    
    // Store connection for reuse
    dbConnections[connectionKey] = db;
    
    return db;
  } catch (error) {
    console.error(`${type} database connection failed:`, error);
    throw new Error(`Failed to connect to ${type} database: ${error}`);
  }
}

/**
 * Initialize a Neo4j graph database connection
 * @param uri Neo4j connection URI
 * @param username Username for authentication
 * @param password Password for authentication
 * @param database Database name (optional)
 * @returns Neo4j driver instance
 */
export async function initializeNeo4j(
  uri: string, 
  username: string, 
  password: string,
  database?: string
): Promise<neo4j.Driver> {
  // Create a connection key
  const connectionKey = `neo4j:${uri}:${username}:${database || 'default'}`;
  
  // Return existing connection if available
  if (neo4jConnections[connectionKey]) {
    return neo4jConnections[connectionKey];
  }
  
  try {
    // Create a driver without setting database in config
    const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
    
    
    // Store connection for reuse
    neo4jConnections[connectionKey] = driver;
    
    return driver;
  } catch (error) {
    console.error('Neo4j connection failed:', error);
    throw new Error(`Failed to connect to Neo4j: ${error}`);
  }
}

/**
 * Run a Cypher query against a Neo4j database
 * @param driver Neo4j driver instance
 * @param query Cypher query to execute
 * @param params Parameters for the query
 * @returns Query results
 */
export async function runCypherQuery(
  driver: neo4j.Driver,
  query: string,
  params: Record<string, any> = {}
): Promise<any[]> {
  const session = driver.session();
  
  try {
    const result = await session.run(query, params);
    
    // Convert Neo4j records to plain objects
    return result.records.map((record: { keys: any[]; get: (arg0: any) => any; }) => {
      const obj: Record<string, any> = {};
      
      record.keys.forEach(key => {
        const value = record.get(key);
        
        // Handle Neo4j specific types
        if (value && typeof value === 'object' && value.constructor.name === 'Node') {
          // Convert Node objects to plain objects with properties and labels
          obj[key] = {
            id: value.identity.toInt(),
            labels: value.labels,
            properties: Object.fromEntries(
              Object.entries(value.properties).map(([k, v]) => 
                [k, v instanceof neo4j.types.Integer ? v.toInt() : v]
              )
            )
          };
        } else if (value && typeof value === 'object' && value.constructor.name === 'Relationship') {
          // Convert Relationship objects to plain objects
          obj[key] = {
            id: value.identity.toInt(),
            type: value.type,
            start: value.start.toInt(),
            end: value.end.toInt(),
            properties: Object.fromEntries(
              Object.entries(value.properties).map(([k, v]) => 
                [k, v instanceof neo4j.types.Integer ? v.toInt() : v]
              )
            )
          };
        } else if (value instanceof neo4j.types.Integer) {
          // Convert Neo4j Integer to JavaScript number
          obj[key] = value.toInt();
        } else {
          obj[key] = value;
        }
      });
      
      return obj;
    });
  } finally {
    await session.close();
  }
}

/**
 * Get graph schema information from Neo4j database
 * @param driver Neo4j driver instance
 * @returns Schema information including node labels, relationship types, and properties
 */
export async function getGraphSchema(driver: neo4j.Driver): Promise<any> {
  const nodeLabelsQuery = `
    CALL db.labels() YIELD label
    RETURN collect(label) AS labels
  `;
  
  const relTypesQuery = `
    CALL db.relationshipTypes() YIELD relationshipType
    RETURN collect(relationshipType) AS relationshipTypes
  `;
  
  const nodePropertiesQuery = `
    CALL db.schema.nodeTypeProperties() YIELD nodeType, propertyName
    RETURN nodeType, collect(propertyName) AS properties
  `;
  
  const session = driver.session();
  
  try {
    const [labelsResult, relTypesResult, propertiesResult] = await Promise.all([
      session.run(nodeLabelsQuery),
      session.run(relTypesQuery),
      session.run(nodePropertiesQuery)
    ]);
    
    const labels = labelsResult.records[0].get('labels');
    const relationshipTypes = relTypesResult.records[0].get('relationshipTypes');
    
    const nodeProperties = propertiesResult.records.map(record => ({
      nodeType: record.get('nodeType'),
      properties: record.get('properties')
    }));
    
    return {
      nodeLabels: labels,
      relationshipTypes: relationshipTypes,
      nodeProperties: nodeProperties
    };
  } finally {
    await session.close();
  }
}

// Redis connection store
const redisConnections: Record<string, Redis> = {};

/**
 * Initialize a Redis connection
 * @param options Redis connection options
 * @returns Redis client instance
 */
export async function initializeRedis(options: {
  host: string,
  port: number,
  password?: string,
  db?: number
}): Promise<Redis> {
  const { host, port, password, db } = options;
  
  // Create a connection key
  const connectionKey = `redis:${host}:${port}:${db || 0}`;
  
  // Return existing connection if available
  if (redisConnections[connectionKey]) {
    return redisConnections[connectionKey];
  }
  
  try {
    // Create new Redis client
    const redis = new Redis({
      host,
      port,
      password,
      db
    });
    
    // Verify connection
    await redis.ping();
    
    // Store connection for reuse
    redisConnections[connectionKey] = redis;
    
    return redis;
  } catch (error) {
    console.error('Redis connection failed:', error);
    throw new Error(`Failed to connect to Redis: ${error}`);
  }
}

/**
 * Create a semantic cache using Redis
 * Good for storing embeddings and query results
 * @param redis Redis client
 * @param prefix Key prefix for cache entries
 * @param ttl Time-to-live in seconds (default: 1 hour)
 */
export async function cacheQueryResult(
  redis: Redis,
  key: string,
  value: any,
  ttl: number = 3600
): Promise<void> {
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
}

/**
 * Get a cached result from Redis
 * @param redis Redis client
 * @param key Cache key
 * @returns Cached value or null if not found
 */
export async function getCachedResult(
  redis: Redis,
  key: string
): Promise<any | null> {
  const cached = await redis.get(key);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  return null;
}

/**
 * Create a vector store using MongoDB Atlas Vector Search
 * @param collection MongoDB collection
 * @param embeddings Embeddings instance (defaults to OpenAI)
 * @returns Vector store instance
 */
export async function createVectorStore(
  collection: any,
  embeddings: any = new OpenAIEmbeddings()
): Promise<MongoDBAtlasVectorSearch> {
  try {
    return new MongoDBAtlasVectorSearch(embeddings, {
      collection,
      indexName: "vectorSearchIndex", // Update this to your actual index name
      textKey: "text",
      embeddingKey: "embedding",
    });
  } catch (error) {
    console.error('Vector store creation failed:', error);
    throw new Error(`Failed to create vector store: ${error}`);
  }
}

/**
 * Execute a SQL query against a LangChain SQL database
 * @param db LangChain SQL database instance
 * @param query SQL query to execute
 * @returns Query result
 */
export async function executeSQLQuery(db: SqlDatabase, query: string): Promise<any> {
  try {
    return await db.run(query);
  } catch (error) {
    console.error('SQL query execution failed:', error);
    throw new Error(`SQL query execution failed: ${error}`);
  }
}

/**
 * Query documents from a MongoDB collection
 * @param db MongoDB database instance
 * @param collectionName Collection name
 * @param query MongoDB query
 * @returns Query result
 */
export async function queryMongoCollection(db: Db, collectionName: string, query: any): Promise<any[]> {
  try {
    const collection = db.collection(collectionName);
    return await collection.find(query).toArray();
  } catch (error) {
    console.error('MongoDB query failed:', error);
    throw new Error(`MongoDB query failed: ${error}`);
  }
}

/**
 * Convert MongoDB documents to LangChain documents for vector search
 * @param documents MongoDB documents
 * @param textField Field containing the text content
 * @param metadataFields Fields to include in metadata
 * @returns LangChain documents
 */
export function convertToLangChainDocuments(
  documents: any[], 
  textField: string = 'content',
  metadataFields: string[] = []
): Document[] {
  return documents.map(doc => {
    const metadata: Record<string, any> = {};
    
    metadataFields.forEach(field => {
      if (doc[field] !== undefined) {
        metadata[field] = doc[field];
      }
    });
    
    // Always include _id in metadata
    if (doc._id) {
      metadata._id = doc._id.toString();
    }
    
    return new Document({
      pageContent: doc[textField] || "",
      metadata
    });
  });
}

/**
 * Semantic search over MongoDB Atlas Vector Search
 * @param vectorStore Vector store instance
 * @param query Search query
 * @param k Number of results to return
 * @returns Search results
 */
export async function semanticSearch(
  vectorStore: MongoDBAtlasVectorSearch, 
  query: string, 
  k: number = 5
): Promise<Document[]> {
  try {
    return await vectorStore.similaritySearch(query, k);
  } catch (error) {
    console.error('Semantic search failed:', error);
    throw new Error(`Semantic search failed: ${error}`);
  }
}

/**
 * Create a hybrid search combining vector search with graph traversal
 * @param vectorStore Vector store instance
 * @param graphDriver Neo4j driver instance
 * @param query Search query
 * @param options Search options
 * @returns Combined search results
 */
export async function hybridSearch(
  vectorStore: MongoDBAtlasVectorSearch,
  graphDriver: neo4j.Driver,
  query: string,
  options: {
    vectorK?: number,
    graphRelationDepth?: number,
    nodeLabel?: string,
    relationshipType?: string
  } = {}
): Promise<Document[]> {
  try {
    // Vector search first
    const vectorResults = await vectorStore.similaritySearch(
      query, 
      options.vectorK || 5
    );
    
    // Extract IDs to use in graph search
    const documentIds = vectorResults.map(doc => 
      doc.metadata._id || doc.metadata.id
    ).filter(Boolean);
    
    if (documentIds.length === 0) {
      // No vector results to enhance with graph data
      return vectorResults;
    }
    
    // Use graph database to find related information
    const session = graphDriver.session();
    
    try {
      const nodeLabel = options.nodeLabel || 'Document';
      const relationshipType = options.relationshipType || 'RELATED_TO';
      const depth = options.graphRelationDepth || 1;
      
      const cypherQuery = `
        MATCH (d:${nodeLabel})
        WHERE d.id IN $documentIds
        MATCH path = (d)-[r:${relationshipType}*1..${depth}]-(related)
        RETURN d.id AS sourceId, related, type(last(relationships(path))) AS relType
        LIMIT 20
      `;
      
      const result = await session.run(cypherQuery, { documentIds });
      
      // Enhance vector results with graph data
      const enhancedResults = vectorResults.map(doc => {
        const docId = doc.metadata._id || doc.metadata.id;
        const graphRelations = result.records
          .filter(record => record.get('sourceId') === docId)
          .map(record => ({
            nodeType: record.get('related').labels[0],
            relationType: record.get('relType'),
            properties: record.get('related').properties
          }));
        
        // Add graph relations to metadata
        if (graphRelations.length > 0) {
          doc.metadata.graphRelations = graphRelations;
        }
        
        return doc;
      });
      
      return enhancedResults;
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error('Hybrid search failed:', error);
    throw new Error(`Hybrid search failed: ${error}`);
  }
}
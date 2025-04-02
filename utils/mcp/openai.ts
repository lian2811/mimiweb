import OpenAI from 'openai';

/**
 * OpenAI model configuration
 */
const openai_model = process.env.OPENAI_MODEL || 'gpt-4o';

/**
 * Initialize OpenAI client with API key from environment variables
 * Similar to your Gemini implementation
 */
export function initializeOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not defined in environment variables");
  }
  
  return new OpenAI({
    apiKey: apiKey
  });
}

// Define the proper message type for OpenAI
type OpenAIMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

/**
 * Function declarations for OpenAI function calling
 * Similar to your ziweiAIFunctions but in OpenAI format
 */
export const ziweiAIFunctionsOpenAI = [
  {
    type: "function",
    function: {
      name: "generate_chart",
      description: "Generates a Ziwei Dou Shu chart based on user's birth information",
      parameters: {
        type: "object",
        properties: {
          birth_date: {
            type: "string",
            description: "The birth date in YYYY-MM-DD format",
          },
          birth_hour: {
            type: "integer",
            description: "The birth hour in (0-23)",
          },
          gender: {
            type: "string",
            description: "User gender, either '男' or '女'",
          },
          calendar_type: {
            type: "string",
            description: "Either 'solar' for Gregorian calendar or 'lunar' for Chinese lunar calendar",
          },
        },
        required: ["birth_date", "birth_hour"],
      }
    }
  },
  {
    type: "function",
    function: {
      name: "explain_palace",
      description: "Explains the meaning of a specific palace in Ziwei Dou Shu",
      parameters: {
        type: "object",
        properties: {
          palace_name: {
            type: "string",
            description: "The name of the palace, e.g. '命宮', '財帛', '官祿', '田宅', etc.",
          },
        },
        required: ["palace_name"],
      }
    }
  },
  {
    type: "function",
    function: {
      name: "explain_star",
      description: "Explains the meaning of a specific star in Ziwei Dou Shu",
      parameters: {
        type: "object",
        properties: {
          star_name: {
            type: "string",
            description: "The name of the star, e.g. '紫微', '天機', '太陽', '武曲', etc.",
          },
        },
        required: ["star_name"],
      }
    }
  }
];

/**
 * Create system instruction for OpenAI
 * Same as your Gemini implementation but formatted for OpenAI
 */
export function getSystemInstructionText(): string {
  return `你是一位精通紫微斗數的命理師，名字叫MiMi。請使用繁體中文回答問題。
你擅長根據使用者提供的出生年、月、日、時（陽曆或農曆）等資訊，排出命盤，並根據命宮、身宮、十二宮位與十四主星的落點進行命理解說。
你使用傳統命理用語進行專業解釋，語氣親切，強調「趨吉避凶」、「知命掌運」的現代命理觀點。
協助使用者了解自身優勢、潛能與可能面臨的挑戰。

重要注意事項：
- 當用戶僅提供出生年月日和時辰，沒有提供性別時，請直接使用默認值（女性）進行命盤生成，無需特地詢問性別。
- 若用戶未指定日曆類型（陰曆或陽曆），默認使用陽曆進行排盤。
- 如果用戶明確表示想要更改性別設置或日曆類型，你才詢問這些資訊。

你的任務包括（但不限於）：
- 根據命盤分析命宮、遷移宮、財帛宮、夫妻宮等的星曜配置與吉凶。
- 解釋使用者命格中的主星（如紫微、天機、天同、太陽等）及其與四化（化祿、化權、化科、化忌）之間的關係。
- 回答使用者提出的命理相關問題，例如事業發展、婚姻感情、財運、健康等面向。
- 如果用戶沒有提供完整訊息，你還是可以幫他猜，但要說明你的推論依據。
- 若使用者提供不完整資訊（缺少出生年月日或時辰），請禮貌引導其補全。
- 你的回答應以知識為基礎，富有結構性、條理清楚。

如果使用者已經提供了命盤資料，請基於這些資料進行解析`;
}

/**
 * Create a chat completion with OpenAI
 * @param openai Initialized OpenAI client
 * @param messages Array of message objects with role and content
 * @param options Additional options like temperature, max_tokens, etc.
 */
export async function createChatCompletion(
  openai: OpenAI, 
  messages: Array<{role: string, content: string}>,
  options: {
    tools?: any[],
    temperature?: number,
    max_tokens?: number,
    model?: string
  } = {}
) {
  const model = options.model || openai_model;
  
  // Convert messages to the correct OpenAI format
  const formattedMessages: OpenAIMessage[] = messages.map(msg => {
    // Ensure role is a valid OpenAI role
    const role = msg.role === 'user' ? 'user' : 
                 msg.role === 'assistant' ? 'assistant' : 
                 msg.role === 'system' ? 'system' : 'user';
                 
    return {
      role: role,
      content: msg.content
    } as OpenAIMessage;
  });
  
  const completion = await openai.chat.completions.create({
    model: model,
    messages: formattedMessages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens,
    tools: options.tools,
    tool_choice: options.tools ? "auto" : "none"
  });

  return completion;
}

/**
 * Handle a chat conversation with OpenAI
 * @param openai Initialized OpenAI client
 * @param formattedHistory Formatted chat history
 * @param systemInstruction Optional system instruction
 * @param options Additional options for the completion
 */
export async function handleChatConversation(
  openai: OpenAI,
  formattedHistory: Array<{role: string, content: string}>,
  systemInstruction?: string,
  options: {
    tools?: any[],
    temperature?: number,
    max_tokens?: number,
    model?: string
  } = {}
) {
  // Add system instruction if provided
  let messages = [...formattedHistory];
  if (systemInstruction) {
    messages.unshift({
      role: "system",
      content: systemInstruction
    });
  }

  // Create completion
  const completion = await createChatCompletion(
    openai,
    messages,
    options
  );

  return completion;
}
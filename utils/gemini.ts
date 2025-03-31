import { GoogleGenAI, FunctionDeclaration, FunctionCallingConfigMode, Type } from "@google/genai";

/**
 * 初始化 Gemini API 客户端
 */
const gemini_model = process.env.GEMINI_MODEL;
export function initializeGemini() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * 紫微斗数相关的函数声明
 */
export const ziweiAIFunctions: FunctionDeclaration[] = [
  {
    name: "generate_chart",
    description: "Generates a Ziwei Dou Shu chart based on user's birth information",
    parameters: {
      type: Type.OBJECT,
      properties: {
        birth_date: {
          type: Type.STRING,
          description: "The birth date in YYYY-MM-DD format",
        },
        birth_hour: {
          type: Type.INTEGER,
          description: "The birth hour in (0-23)",
        },
        gender: {
          type: Type.STRING,
          description: "User gender, either '男' or '女'",
        },
        calendar_type: {
          type: Type.STRING,
          description: "Either 'solar' for Gregorian calendar or 'lunar' for Chinese lunar calendar",
        },
      },
      // 更新：仅保留必要参数，性别和日历类型现在是可选的
      required: ["birth_date", "birth_hour"],
    },
  } as FunctionDeclaration,
  {
    name: "explain_palace",
    description: "Explains the meaning of a specific palace in Ziwei Dou Shu",
    parameters: {
      type: Type.OBJECT,
      properties: {
        palace_name: {
          type: Type.STRING,
          description: "The name of the palace, e.g. '命宮', '財帛', '官祿', '田宅', etc.",
        },
      },
      required: ["palace_name"],
    },
  } as FunctionDeclaration,
  {
    name: "explain_star",
    description: "Explains the meaning of a specific star in Ziwei Dou Shu",
    parameters: {
      type: Type.OBJECT,
      properties: {
        star_name: {
          type: Type.STRING,
          description: "The name of the star, e.g. '紫微', '天機', '太陽', '武曲', etc.",
        },
      },
      required: ["star_name"],
    },
  } as FunctionDeclaration,
];

/**
 * 创建紫微斗数的系统指令文本
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
 * 创建 AI 聊天实例
 * @param ai 初始化后的 Gemini API 客户端
 * @param formattedHistory 格式化的聊天历史
 */
export function createAIChat(ai: any, formattedHistory: any) {
  return ai.chats.create({
    model: gemini_model,
    history: formattedHistory,
    config: {
      systemInstruction: getSystemInstructionText(),
      tools: [{
        functionDeclarations: ziweiAIFunctions
      }],
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingConfigMode.AUTO
        }
      }
    }
  });
}



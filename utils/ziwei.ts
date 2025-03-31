import { astro } from 'iztro';
import FunctionalAstrolabe from 'iztro/lib/astro/FunctionalAstrolabe';
// Import the `PalaceName` type from the `iztro` library to ensure compatibility.
import { PalaceName } from 'iztro/lib/i18n';

// 定义 GenderName 类型
type GenderName = '男' | '女';

// 定義紫微斗數十二宮位常量 - 与 ChatBox.tsx 统一
export const ZIWEI_PALACES = ['命宮', '財帛', '官祿', '田宅', '福德', '夫妻', '子女', '遷移', '兄弟', '父母', '疾厄', '僕役'];

/**
 * 使用 iztro 函式庫生成紫微命盤
 * 增加参数默认值：默认日历类型为阳历，默认性别为女性
 */
export function generateChart(args: {
  birth_date: string;
  birth_hour: number;
  gender?: GenderName; // 设为可选参数
  calendar_type?: 'solar' | 'lunar'; // 设为可选参数
}) {
  try {
    // 处理默认值：日历类型默认为阳历，性别默认为女性
    const { 
      birth_date, 
      birth_hour, 
      gender = '女', // 默认性别为女性
      calendar_type = 'solar' // 默认使用阳历
    } = args;
    
    // Generate chart using FunctionalAstrolabe from iztro
    let astrolabe: FunctionalAstrolabe;
    
    if (calendar_type === 'lunar') {
      astrolabe = astro.byLunar(
        birth_date,
        birth_hour,
        gender,
        false, // 是否採用傳統方式計算命宮
        true,  // 是否輸出傳統紫微星盤格式
        'zh-TW' // 語言
      ) as FunctionalAstrolabe;
    } else {
      astrolabe = astro.bySolar(
        birth_date,
        birth_hour,
        gender,
        true,  // 是否輸出傳統紫微星盤格式
        'zh-TW' // 語言
      ) as FunctionalAstrolabe;
    }

    // 创建更详细准确的摘要信息，确保能提取到主星
    const main_stars_array: string[] = [];
    
    if (typeof astrolabe.palace === 'function') {
      // 遍历所有宫位，提取主星信息
      for (const palaceName of ZIWEI_PALACES) {
        try {
          const palace = astrolabe.palace(palaceName as PalaceName);
          if (palace && palace.majorStars && palace.majorStars.length > 0) {
            // 获取宫位主星名称
            const majorStarNames = palace.majorStars.map((star: any) => star.name).join(', ');
            main_stars_array.push(`${palaceName}宮: ${majorStarNames}`);
          }
        } catch (error) {
          console.error(`无法获取${palaceName}宫的主星信息:`, error);
        }
      }
    } else if (astrolabe.palaces && Array.isArray(astrolabe.palaces)) {
      // 如果palace不是函数而是数组，则从数组中提取
      for (const palace of astrolabe.palaces) {
        if (palace && palace.name && palace.majorStars && palace.majorStars.length > 0) {
          const majorStarNames = palace.majorStars.map((star: any) => star.name).join(', ');
          main_stars_array.push(`${palace.name}宮: ${majorStarNames}`);
        }
      }
    }

    const summary = {
      main_stars: main_stars_array,
      ming_gong: astrolabe.palace('命宮'),
      shen_gong: astrolabe.palace('身宮'),
      soul: astrolabe.soul,
      body: astrolabe.body,
      fiveElementsClass: astrolabe.fiveElementsClass
    };
    
    // 将原始astrolabe对象转为可序列化的格式
    const sanitizedChartData = sanitizeChartDataForSerialization(astrolabe);

    return {
      result: `生辰八字：${birth_date}，${birth_hour}時辰，${gender}性，${calendar_type === 'solar' ? '陽曆' : '農曆'}，成功生成命盤`,
      chartData: sanitizedChartData,
      summary: summary
    };
  } catch (error: any) {
    console.error("Error generating chart:", error);
    return {
      result: `生成命盤時發生錯誤：${error.message}`,
      error: true
    };
  }
}

/**
 * 轉換複雜的命盤數據結構為可序列化的格式，避免循環引用
 */
export function sanitizeChartDataForSerialization(chartData: any) {
  try {
    if (!chartData) return null;
    
    // 提取命盤的關鍵資訊
    const horoscope = chartData.horoscope ? {
      gender: chartData.gender || chartData.horoscope.gender,
      solarDate: chartData.solarDate || chartData.horoscope.solarDate,
      lunarDate: chartData.lunarDate || chartData.horoscope.lunarDate,
      time: chartData.time || chartData.horoscope.time,
      timeRange: chartData.timeRange || chartData.horoscope.timeRange,
      sign: chartData.sign || chartData.horoscope.sign,
      zodiac: chartData.zodiac || chartData.horoscope.zodiac,
      soul: chartData.soul || chartData.horoscope.soul,
      body: chartData.body || chartData.horoscope.body,
      fiveElementsClass: chartData.fiveElementsClass || chartData.horoscope.fiveElementsClass,
      chineseTime: chartData.chineseTime || chartData.horoscope.chineseTime
    } : {
      gender: chartData.gender,
      solarDate: chartData.solarDate,
      lunarDate: chartData.lunarDate,
      time: chartData.time,
      timeRange: chartData.timeRange,
      sign: chartData.sign,
      zodiac: chartData.zodiac,
      soul: chartData.soul,
      body: chartData.body,
      fiveElementsClass: chartData.fiveElementsClass,
      chineseTime: chartData.chineseTime
    };
    
    // 處理宮位資訊，避免循環引用
    const palaces = [];
    
    // 標準的十二地支順序 - 與ZiweiChart.tsx中保持一致
    const standardBranches = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
    
    // 使用统一的宫位名称顺序
    const palaceNameMap: Record<number, string> = {};
    for (let i = 0; i < standardBranches.length; i++) {
      palaceNameMap[i] = ZIWEI_PALACES[i];
    }
    
    // 使用standardBranches作為索引，確保命盤數據按照正確的順序生成
    if (typeof chartData.palace === 'function') {
      // 遍歷所有的宮位名稱，確保12宮都存在
      for (let i = 0; i < ZIWEI_PALACES.length; i++) {
        const palaceName = ZIWEI_PALACES[i];
        const branch = standardBranches[i]; // 對應的地支
        
        try {
          const palace = chartData.palace(palaceName);
          if (palace) {
            // 如果成功獲取宮位數據，則添加到結果中
            const palaceData = {
              name: palaceName,
              index: i, // 使用索引作為宮位的index
              majorStars: palace.majorStars ? palace.majorStars.map((star: any) => ({
                name: star.name,
                brightness: star.brightness,
                type: star.type,
                mutagen: star.mutagen
              })) : [],
              minorStars: palace.minorStars ? palace.minorStars.map((star: any) => ({
                name: star.name,
                brightness: star.brightness,
                type: star.type
              })) : [],
              adjectiveStars: palace.adjectiveStars ? palace.adjectiveStars.map((star: any) => ({
                name: star.name,
                type: star.type
              })) : [],
              earthlyBranch: palace.earthlyBranch || branch,
              heavenlyStem: palace.heavenlyStem || "",
              isBodyPalace: palace.isBodyPalace || false,
              isOriginalPalace: false,
              changsheng12: palace.changsheng12 || "",
              ages: palace.ages || [],
              // 新增: 提取大限信息
              decadal: palace.decadal ? {
                range: palace.decadal.range || []
              } : { range: [] }
            };
            palaces.push(palaceData);
          } else {
            // 如果無法獲取宮位，創建一個空數據
            const emptyPalace = {
              name: palaceName,
              index: i,
              majorStars: [],
              minorStars: [],
              adjectiveStars: [],
              earthlyBranch: branch,
              heavenlyStem: "",
              isBodyPalace: false,
              isOriginalPalace: false,
              changsheng12: "",
              ages: [],
              decadal: { range: [] }
            };
            palaces.push(emptyPalace);
          }
        } catch (error) {
          console.error(`Error extracting palace ${palaceName}:`, error);
          // 發生錯誤時也添加空數據
          const emptyPalace = {
            name: palaceName,
            index: i,
            majorStars: [],
            minorStars: [],
            adjectiveStars: [],
            earthlyBranch: branch,
            heavenlyStem: "",
            isBodyPalace: false,
            isOriginalPalace: false,
            changsheng12: "",
            ages: [],
            decadal: { range: [] }
          };
          palaces.push(emptyPalace);
        }
      }
    } else if (Array.isArray(chartData.palaces)) {
      // 如果已經是數組形式，先創建一個映射來存儲現有的宮位數據
      const existingPalaces = new Map();
      chartData.palaces.forEach((palace: any) => {
        existingPalaces.set(palace.name, palace);
      });
      
      // 然後按照標準順序生成新的宮位數組
      for (let i = 0; i < ZIWEI_PALACES.length; i++) {
        const palaceName = ZIWEI_PALACES[i];
        const branch = standardBranches[i];
        
        // 檢查是否已存在該宮位
        if (existingPalaces.has(palaceName)) {
          const palace = existingPalaces.get(palaceName);
          const palaceData = {
            name: palaceName,
            index: i, 
            majorStars: palace.majorStars ? palace.majorStars.map((star: any) => ({
              name: star.name,
              brightness: star.brightness,
              type: star.type,
              mutagen: star.mutagen
            })) : [],
            minorStars: palace.minorStars ? palace.minorStars.map((star: any) => ({
              name: star.name,
              brightness: star.brightness,
              type: star.type
            })) : [],
            adjectiveStars: palace.adjectiveStars ? palace.adjectiveStars.map((star: any) => ({
              name: star.name,
              type: star.type
            })) : [],
            earthlyBranch: palace.earthlyBranch || branch,
            heavenlyStem: palace.heavenlyStem || "",
            isBodyPalace: palace.isBodyPalace || false,
            isOriginalPalace: false,
            changsheng12: palace.changsheng12 || "",
            ages: palace.ages || [],
            // 新增: 保留大限信息
            decadal: palace.decadal ? {
              range: palace.decadal.range || []
            } : { range: [] }
          };
          palaces.push(palaceData);
        } else {
          // 不存在則創建空數據
          const emptyPalace = {
            name: palaceName,
            index: i,
            majorStars: [],
            minorStars: [],
            adjectiveStars: [],
            earthlyBranch: branch,
            heavenlyStem: "",
            isBodyPalace: false,
            isOriginalPalace: false,
            changsheng12: "",
            ages: [],
            decadal: { range: [] }
          };
          palaces.push(emptyPalace);
        }
      }
    }
    
    // 如果有大運(decadal)数据，确保添加到结果中
    if (chartData.decadal) {
      try {
        // 遍历宫位，添加大运信息
        palaces.forEach((palace: any) => {
          if (!palace.decadal) {
            palace.decadal = { range: [] };
          }
          
          // 如果原始数据中有对应信息，使用原始数据
          if (chartData.decadal[palace.name]) {
            palace.decadal = {
              range: chartData.decadal[palace.name].range || []
            };
          }
          
          // 如果没有大运范围但有ages数组，通过年龄计算大运范围
          if (!palace.decadal.range || palace.decadal.range.length === 0) {
            if (palace.ages && palace.ages.length > 0) {
              // 添加基本的大运年龄范围 (每个大运10年)
              palace.decadal.range = [palace.ages[0], palace.ages[0] + 9];
            }
          }
        });
      } catch (error) {
        console.error("Error processing decadal data:", error);
      }
    }
    
    // 構建最終可序列化的對象
    const result = {
      horoscope,
      palaces,
      earthlyBranchOfSoulPalace: chartData.earthlyBranchOfSoulPalace || null,
      earthlyBranchOfBodyPalace: chartData.earthlyBranchOfBodyPalace || null,
      solarDate: chartData.solarDate,
      lunarDate: chartData.lunarDate,
      chineseDate: chartData.chineseDate,
      time: chartData.time,
      timeRange: chartData.timeRange,
      sign: chartData.sign,
      soul: chartData.soul,
      body: chartData.body,
      fiveElementsClass: chartData.fiveElementsClass,
      // 確保添加全局大運信息
      decadal: chartData.decadal || {}
    };
    
    return result;
  } catch (error) {
    console.error("Error sanitizing chart data:", error);
    // 如果處理失敗，返回最小化的資訊
    return {
      error: "無法序列化完整命盤，僅返回基本資訊",
      basic: {
        gender: chartData?.gender || chartData?.horoscope?.gender || "未知",
        birthDate: chartData?.solarDate || chartData?.horoscope?.solarDate || 
                  chartData?.lunarDate || chartData?.horoscope?.lunarDate || "未知"
      }
    };
  }
}


/**
 * 從命盤資料中提取摘要資訊，用於AI提示
 */
export function extractChartSummary(parsedChartInfo: any): string {
  let chartSummary = `使用者已有命盤資料 - `;
  chartSummary += `出生日期: ${parsedChartInfo.solarDate || parsedChartInfo.lunarDate || '未知'}, `;
  chartSummary += `性別: ${parsedChartInfo.gender || parsedChartInfo.horoscope?.gender || '未知'}, `;
  
  if (parsedChartInfo.time) {
    chartSummary += `時辰: ${parsedChartInfo.time}, `;
  }
  
  if (parsedChartInfo.fiveElementsClass) {
    chartSummary += `五行局: ${parsedChartInfo.fiveElementsClass}, `;
  }
  
  if (parsedChartInfo.body) {
    chartSummary += `身宮主星: ${parsedChartInfo.body}, `;
  }
  
  if (parsedChartInfo.soul) {
    chartSummary += `命宮主星: ${parsedChartInfo.soul}, `;
  }
  
  // 加入所有宮位的重要星曜
  if (parsedChartInfo.majorStars && Object.keys(parsedChartInfo.majorStars).length > 0) {
    chartSummary += `主要宮位星曜: `;
    
    // 使用已定義的ZIWEI_PALACES常量展示所有宮位
    for (const palace of ZIWEI_PALACES) {
      if (parsedChartInfo.majorStars[palace]) {
        chartSummary += `${palace}(${parsedChartInfo.majorStars[palace]}), `;
      }
    }
  } else if (parsedChartInfo.palaces) {
    // 如果沒有 majorStars 屬性但有宮位數組，嘗試從宮位數組中提取主星信息
    chartSummary += `主要宮位星曜: `;
    
    // 使用已定義的ZIWEI_PALACES常量展示所有宮位
    for (const palaceName of ZIWEI_PALACES) {
      const palace = parsedChartInfo.palaces.find((p: any) => p.name === palaceName);
      if (palace && palace.majorStars && palace.majorStars.length > 0) {
        const starNames = palace.majorStars.map((s: any) => s.name).join(',');
        chartSummary += `${palaceName}(${starNames}), `;
      }
    }
  }
  
  // 移除最後的逗號和空格
  return chartSummary.replace(/, $/, '');
}
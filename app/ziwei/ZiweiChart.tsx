'use client';
import { ReactNode } from 'react';
import PalaceBox from './PalaceBox';

interface Star {
  name: string;
  type?: string;
  scope?: string;
  brightness?: string;
  isReverse?: boolean;
  mutagen?: string;
}

interface Palace {
  index: number;
  name: string;
  heavenlyStem: string;
  earthlyBranch: string;
  majorStars?: Star[];
  minorStars?: Star[];
  adjectiveStars?: Star[];
  isBodyPalace?: boolean;
  isOriginalPalace?: boolean;
  changsheng12: string;
  ages?: number[];
  decadal?: { range?: number[] };
}

interface ZiweiChartData {
  earthlyBranchOfSoulPalace: ReactNode;
  earthlyBranchOfBodyPalace: ReactNode;
  solarDate?: string;
  lunarDate?: string;
  chineseDate?: string;
  time?: string;
  timeRange?: string;
  sign?: string;
  soul?: string;
  body?: string;
  fiveElementsClass?: string;
  palaces?: Palace[];
}
const branchToGridPosition: Record<string, [number, number]> = {
  '寅': [1, 4],
  '卯': [1, 3],
  '辰': [1, 2],
  '巳': [1, 1],
  '午': [2, 1],
  '未': [3, 1],
  '申': [4, 1],
  '酉': [4, 2],
  '戌': [4, 3],
  '亥': [4, 4],
  '子': [3, 4],
  '丑': [2, 4],
};

const ZiweiChart = ({ data }: { data: ZiweiChartData }) => {
  if (!data?.palaces) return <div>無法顯示命盤，資料不完整</div>;

  // 定義標準的十二地支順序
  const standardBranches =  ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

  // 依據標準地支順序，從資料中找出對應的宮位，並取得其 grid 位置
  const palacePositions = standardBranches.map(branch => {
    const palace = data.palaces?.find(p => p.earthlyBranch === branch);
    const gridPosition = branchToGridPosition[branch] || [0, 0];
    return { palace, gridPosition, branch };
  });

  return (
    <div className="w-full h-full flex items-center justify-center p-1">
      <div className="w-full h-full max-h-full bg-gradient-to-br from-white/90 to-pink-100/90 backdrop-blur-sm rounded-xl flex flex-col justify-center shadow-lg">
        <div className="grid grid-cols-4 grid-rows-4 gap-1 h-full w-full">
          {palacePositions.map(({ palace, gridPosition}, i) =>
            palace ? (
              <div
                key={i}
                style={{ gridColumnStart: gridPosition[0], gridRowStart: gridPosition[1] }}
                className="overflow-hidden w-full h-full"
              >
                {/* 傳入宮位資料，這裡也可傳入 isLife 或其他標記，讓 PalaceBox 可依此調整顯示 */}
                <PalaceBox palace={palace} index={i} isLife={palace.isOriginalPalace} />
              </div>
            ) : null
          )}

          {/* 中央區域，顯示其他詳細資料 */}
          <div className="col-start-2 row-start-2 col-span-2 row-span-2 bg-gradient-to-br from-pink-300/70 to-purple-400/70 backdrop-blur-sm rounded-lg text-center p-4 text-sm font-bold text-gray-700 flex flex-col justify-center shadow-md">
            <div>命主：{data.soul}</div>
            <div>身主：{data.body}</div>
            <div>五行局：{data.fiveElementsClass}</div>
            <div className="mt-3 text-gray-600 text-sm font-normal leading-5">
              <div>陽曆：{data.solarDate}</div>
              <div>農曆：{data.lunarDate}</div>
              <div>八字：{data.chineseDate}</div>
              <div>時辰：{data.time} {data.timeRange}</div>
              <div>星座：{data.sign}</div>
              
              {/* 命宮與身宮特別樣式 */}
              <div className="mt-2 flex justify-center space-x-3">
                <div className="bg-gradient-to-r from-pink-500/70 to-purple-500/70 rounded-lg px-3 py-1 shadow-sm text-white">
                  命宮：{data.earthlyBranchOfSoulPalace}
                </div>
                <div className="bg-gradient-to-r from-indigo-500/70 to-blue-500/70 rounded-lg px-3 py-1 shadow-sm text-white">
                  身宮：{data.earthlyBranchOfBodyPalace}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZiweiChart;

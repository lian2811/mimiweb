'use client';
const starColorMap: { [key: string]: string } = {
    // 主星
    '紫微': 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-bold',
    '天機': 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-bold',
    '太陽': 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-bold',
    '武曲': 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-bold',
    '天同': 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-bold',
    '廉貞': 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-bold',
    '天府': 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-bold',
    '太陰': 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-bold',
    '貪狼': 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-bold',
    '巨門': 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-bold',
    '天相': 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-bold',
    '天梁': 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-bold',
    '七殺': 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-bold',
    '破軍': 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 font-bold',
  
    // 吉星
    '文昌': 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600',
    '文曲': 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600',
    '左輔': 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600',
    '右弼': 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600',
    '天魁': 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600',
    '天鉞': 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600',
    '天官': 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600',
  
    // 凶曜
    '火星': 'bg-gradient-to-r from-red-100 to-orange-100 text-red-600',
    '鈴星': 'bg-gradient-to-r from-red-100 to-orange-100 text-red-600',
    '擎羊': 'bg-gradient-to-r from-red-100 to-orange-100 text-red-600',
    '陀羅': 'bg-gradient-to-r from-red-100 to-orange-100 text-red-600',
    '地空': 'bg-gradient-to-r from-red-100 to-orange-100 text-red-600',
    '地劫': 'bg-gradient-to-r from-red-100 to-orange-100 text-red-600',
    '天刑': 'bg-gradient-to-r from-red-100 to-orange-100 text-red-600',
    '天空': 'bg-gradient-to-r from-red-100 to-orange-100 text-red-600',
  };

  const getStarClass = (name: string): string => {
    return starColorMap[name.trim()] || 'bg-gray-100 text-gray-700';
  };
  
  interface Palace {
    majorStars?: { name: string; brightness?: string; mutagen?: string; isReverse?: boolean }[];
    minorStars?: { name: string; brightness?: string; mutagen?: string; isReverse?: boolean }[];
    adjectiveStars?: { name: string; brightness?: string; mutagen?: string; isReverse?: boolean }[];
    name: string;
    heavenlyStem: string;
    earthlyBranch: string;
    ages?: number[];
    decadal?: { range?: number[] };
    changsheng12: string;
    isBodyPalace?: boolean;
  }
  
  interface PalaceBoxProps {
    palace: Palace;
    index: number;
    isLife?: boolean;
    isMobile?: boolean;
  }
  
  const PalaceBox: React.FC<PalaceBoxProps> = ({ palace, isLife, isMobile = false }) => {
    if (!palace) return <div className="bg-gray-50 border rounded-lg h-28" />;
  
    // 始終顯示全部星曜，不再篩選
    const displayStars = [
      ...(palace.majorStars || []),
      ...(palace.minorStars || []),
      ...(palace.adjectiveStars || []),
    ];
  
    // 使用 isLife 判斷是否為命宮
    const isMing = isLife;
  
    return (
        <div
        className={`border border-gray-300 rounded-lg ${isMing ? 'bg-gradient-to-br from-pink-100/90 to-purple-100/90' : palace.isBodyPalace ? 'bg-gradient-to-br from-indigo-100/90 to-blue-100/90' : 'bg-gradient-to-br from-white/90 to-gray-100/90'} 
                    ${isMobile ? 'p-1' : 'p-2'} h-full w-full flex flex-col justify-between ${isMobile ? 'text-[8px]' : 'text-xs'} shadow-sm
                    transition-all duration-200 transform ${!isMobile ? 'hover:scale-105 hover:shadow-xl' : ''} cursor-pointer
                    backdrop-blur-sm`}
        >
          {/* 星曜區（移除捲動） */}
          <div className="flex flex-wrap gap-0.5 overflow-hidden pr-1">
            {displayStars.length ? (
              displayStars.map((star, i) => (
                <span
                  key={i}
                  className={`rounded px-1 py-0.5 shadow-sm ${getStarClass(star.name)} ${isMobile ? 'text-[7px]' : ''}`}
                  title={`${star.name}${star.brightness ? `(${star.brightness})` : ''}${star.mutagen ? ` [${star.mutagen}]` : ''}`}
                >
                  {star.name}
                  {star.mutagen && <span className={`${isMobile ? 'text-[6px]' : 'text-[9px]'} text-purple-500`}>【{star.mutagen}】</span>}
                  {star.isReverse && <sup className="text-orange-500">R</sup>}
                  {star.brightness && <sub className={`${isMobile ? 'text-[6px]' : ''} text-violet-500`}>{star.brightness}</sub>}
                </span>
              ))
            ) : (
              <span className={`text-gray-400 italic ${isMobile ? 'text-[7px]' : ''}`}>無星曜</span>
            )}
          </div>
      
          {/* 底部資訊區 */}
          <div className={`text-center ${isMobile ? 'mt-1' : 'mt-2'}`}>
            <div className={`${isMing ? 'text-pink-600' : palace.isBodyPalace ? 'text-indigo-600' : 'text-teal-600'} font-semibold ${isMobile ? 'text-xs' : 'text-base'}`}>
              {palace.name}
              {isMing && <span className="ml-1 text-pink-500">★</span>}
              {palace.isBodyPalace && <span className="ml-1 text-indigo-500">☯</span>}
            </div>
            <div className={`text-gray-500 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>{palace.heavenlyStem}{palace.earthlyBranch}</div>
            
            {/* 所有模式下顯示完整資訊，僅調整手機版字體大小 */}
            <div className={`${isMobile ? 'text-[6px] mt-0.5 space-y-px' : 'text-[10px] mt-1 space-y-[1px]'} text-gray-500`}>
              <div>年齡：{palace.ages?.join(', ') || '-'}</div>
              <div>大限：{palace.decadal?.range?.join(' ~ ') || '-'} 歲</div>
              <div className="text-violet-500">十二長生：{palace.changsheng12}</div>
              {(palace.isBodyPalace || isMing) && (
                <div className={`flex justify-center gap-1 ${isMobile ? 'mt-0.5' : 'mt-1'}`}>
                  {isMing && <span className={`bg-gradient-to-r from-pink-400/80 to-purple-400/80 text-white px-1 py-0.5 rounded-full text-${isMobile ? '[6px]' : '[9px]'}`}>命宮</span>}
                  {palace.isBodyPalace && <span className={`bg-gradient-to-r from-indigo-400/80 to-blue-400/80 text-white px-1 py-0.5 rounded-full text-${isMobile ? '[6px]' : '[9px]'}`}>身宮</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      );
  };
  
  export default PalaceBox;
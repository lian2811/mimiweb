'use client';

import { useState, useEffect } from 'react';
import { astro } from 'iztro';
import ZiweiChart from '@/app/ziwei/ZiweiChart';
import ChatBox from '@/app/ziwei/ChatBox';
import FunctionalAstrolabe from 'iztro/lib/astro/FunctionalAstrolabe';
import { useTranslations } from 'next-intl';

interface BirthData {
  birth_type: 'solar' | 'lunar';
  birth_date: string;
  birth_hour: string;
  gender: 1 | 0 | null;
  lang: string;
}

export default function Ziwei() {
  const t = useTranslations('ziwei');
  
  const [birthData, setBirthData] = useState<BirthData>({
    birth_type: 'solar',
    birth_date: '',
    birth_hour: '0',
    gender: 0,
    lang: 'zh-TW',
  });
  const [chartData, setChartData] = useState<FunctionalAstrolabe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // 添加一个关联状态，用于跟踪API调用生成的命盘数据是否已经同步到UI
  const [chartDataSynced, setChartDataSynced] = useState<boolean>(true);

  const generateChart = async () => {
    if (!birthData.birth_date) {
      return;
    }

    setLoading(true);
    try {
      const genderString = birthData.gender === 0 ? '女' : '男';
      const birthHourNumber = parseInt(birthData.birth_hour);

      const result =
        birthData.birth_type === 'lunar'
          ? astro.byLunar(
              birthData.birth_date,
              birthHourNumber,
              genderString,
              false,
              true,
              birthData.lang
            )
          : astro.bySolar(
              birthData.birth_date,
              birthHourNumber,
              genderString,
              true,
              birthData.lang
            );
            
      setChartData(result);
      setChartDataSynced(true);
    } catch (error) {
      console.error('命盤計算錯誤:', error);
      alert(t('chartGenerationError'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBirthData({
      ...birthData,
      [name]: name === 'gender' ? (value === '' ? null : parseInt(value) as 1 | 0) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateChart();
  };

  // Handle chart data updates from ChatBox AI function calling
  const handleChartDataUpdate = (newChartData: any) => {
    if (newChartData) {
      console.log("Received new chart data from AI:", newChartData);
      setChartData(newChartData);
      setChartDataSynced(true);
      
      // Optionally update the form values to match the generated chart
      try {
        // Add null checks to prevent accessing properties of undefined
        const solarDate = newChartData.horoscope?.solarDate || newChartData.solarDate;
        const gender = newChartData.horoscope?.gender || newChartData.gender;
        const time = newChartData.horoscope?.chineseTime || newChartData.chineseTime;
        
        
        // Update birth data based on chart details with proper null checks
        setBirthData(prev => ({
          ...prev,
          // Only update if solarDate exists and is long enough
          birth_date: solarDate && solarDate.length >= 10 ? solarDate.substring(0, 10) : prev.birth_date, 
          // If time exists, update it; otherwise keep previous value
          birth_hour: time !== undefined ? String(time) : prev.birth_hour,
          // If gender exists, update it; otherwise keep previous value
          gender: gender === '男' ? 1 : gender === '女' ? 0 : prev.gender,
        }));
      } catch (error) {
        console.error("Error updating form from chart data:", error);
      }
    }
  };

  // 当chartData变更时，验证其是否包含必要的宫位数据，如果没有，可能是序列化问题
  useEffect(() => {
    if (chartData && !chartDataSynced) {
      // 如果chartData存在但未同步（来自API的原始对象），则尝试将其正确显示在UI上
      console.log("Chart data exists but not synced with UI, attempting to sync...");
      setChartDataSynced(true);
    }
  }, [chartData, chartDataSynced]);

  return (
    <div className="min-h-screen pt-24">
      <main className="relative pt-10 px-2 min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex h-full gap-4 max-md:flex-col max-w-[1440px] mx-auto">
            
            {/* ChatBot 區塊 - 使用 Gemini API 聊天室 */}
            <div className="flex-1 overflow-hidden h-[calc(100vh-140px)]">
                <ChatBox 
                  chartData={chartData} 
                  onChartDataUpdate={handleChartDataUpdate}
                />
            </div>

            {/* 命盤顯示區塊 */}
            <div className="flex-1 bg-gradient-to-br from-purple-800/30 to-indigo-900/30 backdrop-blur-lg rounded-xl overflow-hidden p-1 h-[calc(100vh-140px)] flex flex-col">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p>{t('chartGenerating')}</p>
                </div>
            ) : chartData ? (
                <div className="flex-1 w-full h-full">
                    <ZiweiChart data={chartData} />
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-300">
                  <div className="text-center">
                    <p className="mb-4">{t('chartPlaceholder')}</p>
                    <p className="text-sm opacity-80">你可以直接向AI助手詢問，<br />例如：「我是1990年6月15日子時出生的男生，請幫我分析命盤」</p>
                  </div>
                </div>
            )}
            </div>

            {/* 表單欄位 */}
            <div className="bg-white/30 backdrop-blur-lg rounded-xl shadow-xl text-white p-4 space-y-4 self-start">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                  {t('title')}
                </h1>
                <div>
                <label className="block font-semibold mb-1">{t('form.calendarType')}：</label>
                <select
                    name="birth_type"
                    value={birthData.birth_type}
                    onChange={handleInputChange}
                    className="w-full rounded px-3 py-2 bg-white text-black"
                >
                    <option value="solar">{t('form.solar')}</option>
                    <option value="lunar">{t('form.lunar')}</option>
                </select>
                </div>

                <div>
                <label className="block font-semibold mb-1">{t('form.birthDate')}：</label>
                <input
                    type="date"
                    name="birth_date"
                    value={birthData.birth_date}
                    onChange={handleInputChange}
                    className="w-full rounded px-3 py-2 bg-white text-black"
                    required
                />
                </div>

                <div>
                <label className="block font-semibold mb-1">{t('form.birthTime')}：</label>
                <select
                    name="birth_hour"
                    value={birthData.birth_hour}
                    onChange={handleInputChange}
                    className="w-full rounded px-3 py-2 bg-white text-black"
                    required
                >
                    {[
                    ['0', t('hours.0')],
                    ['1', t('hours.1')],
                    ['2', t('hours.2')],
                    ['3', t('hours.3')],
                    ['4', t('hours.4')],
                    ['5', t('hours.5')],
                    ['6', t('hours.6')],
                    ['7', t('hours.7')],
                    ['8', t('hours.8')],
                    ['9', t('hours.9')],
                    ['10', t('hours.10')],
                    ['11', t('hours.11')],
                    ['12', t('hours.12')]
                    ].map(([val, label]) => (
                    <option key={val} value={val}>
                        {label}
                    </option>
                    ))}
                </select>
                </div>

                <div>
                <label className="block font-semibold mb-1">{t('form.gender')}：</label>
                <select
                    name="gender"
                    value={birthData.gender === null ? '' : birthData.gender}
                    onChange={handleInputChange}
                    className="w-full rounded px-3 py-2 bg-white text-black"
                >
                    <option value="0">{t('form.female')}</option>
                    <option value="1">{t('form.male')}</option>
                </select>
                </div>

                <button
                type="submit"
                className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 rounded shadow transition-all disabled:bg-gray-300"
                disabled={loading}
                >
                {loading ? t('chartGenerating') : t('generateChart')}
                </button>
            </form>
            </div>
        </div>
      </main>
    </div>
  );  
}

'use client';

import { useState } from 'react';
import { astro } from 'iztro';
import ZiweiChart from '@/components/ZiweiChart';
import ChatBox from '@/components/ChatBox';

interface BirthData {
  birth_type: 'solar' | 'lunar';
  birth_date: string;
  birth_hour: string;
  gender: 1 | 0 | null;
  lang: string;
}

export default function Ziwei() {
  const [birthData, setBirthData] = useState<BirthData>({
    birth_type: 'solar',
    birth_date: '',
    birth_hour: '0',
    gender: 0,
    lang: 'zh-TW',
  });
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

      console.log('命盤資料：', result);
      setChartData(result);
    } catch (error) {
      console.error('命盤計算錯誤:', error);
      alert('生成紫微命盤時發生錯誤');
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

  return (
    <div className="min-h-screen pt-24">
      <main className="relative pt-24 px-2 min-h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex h-full gap-4 max-md:flex-col max-w-[1440px] mx-auto">
            
            {/* ChatBot 區塊 - 替換為自定義聊天室 */}
            <div className="flex-1 overflow-hidden h-[calc(100vh-140px)]">
                <ChatBox apiKey="app-zUb4Ne1Y9U6nkKYPT7V4qwZB" />
            </div>

            {/* 命盤顯示區塊 */}
            <div className="flex-1 bg-gradient-to-br from-purple-800/30 to-indigo-900/30 backdrop-blur-lg rounded-xl overflow-hidden p-1 h-[calc(100vh-140px)] flex flex-col">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                <div className="w-10 h-10 rounded-full animate-spin mb-4" />
                <p>命盤生成中...</p>
                </div>
            ) : chartData ? (
                <div className="flex-1 w-full h-full">
                    <ZiweiChart data={chartData} />
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-300">輸入生日資訊可以生成命盤或AI親自為您排盤</div>
            )}
            </div>

            {/* 表單欄位 */}
            <div className="bg-white/30 backdrop-blur-lg rounded-xl shadow-xl text-white p-4 space-y-4 self-start">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                  紫微斗數命盤
                </h1>
                <div>
                <label className="block font-semibold mb-1">出生曆法：</label>
                <select
                    name="birth_type"
                    value={birthData.birth_type}
                    onChange={handleInputChange}
                    className="w-full rounded px-3 py-2 bg-white text-black"
                >
                    <option value="solar">陽曆</option>
                    <option value="lunar">農曆</option>
                </select>
                </div>

                <div>
                <label className="block font-semibold mb-1">出生日期：</label>
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
                <label className="block font-semibold mb-1">出生時辰：</label>
                <select
                    name="birth_hour"
                    value={birthData.birth_hour}
                    onChange={handleInputChange}
                    className="w-full rounded px-3 py-2 bg-white text-black"
                    required
                >
                    {[
                    ['0', '早子時 (0:00-1:00)'],
                    ['1', '丑時 (1:00-3:00)'],
                    ['2', '寅時 (3:00-5:00)'],
                    ['3', '卯時 (5:00-7:00)'],
                    ['4', '辰時 (7:00-9:00)'],
                    ['5', '巳時 (9:00-11:00)'],
                    ['6', '午時 (11:00-13:00)'],
                    ['7', '未時 (13:00-15:00)'],
                    ['8', '申時 (15:00-17:00)'],
                    ['9', '酉時 (17:00-19:00)'],
                    ['10', '戌時 (19:00-21:00)'],
                    ['11', '亥時 (21:00-23:00)'],
                    ['12', '晚子時 (23:00-0:00)']
                    ].map(([val, label]) => (
                    <option key={val} value={val}>
                        {label}
                    </option>
                    ))}
                </select>
                </div>

                <div>
                <label className="block font-semibold mb-1">性別：</label>
                <select
                    name="gender"
                    value={birthData.gender === null ? '' : birthData.gender}
                    onChange={handleInputChange}
                    className="w-full rounded px-3 py-2 bg-white text-black"
                >
                    <option value="0">女</option>
                    <option value="1">男</option>
                </select>
                </div>

                <button
                type="submit"
                className="w-full bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 rounded shadow transition-all disabled:bg-gray-300"
                disabled={loading}
                >
                {loading ? '命盤生成中...' : '生成命盤'}
                </button>
            </form>
            </div>
        </div>
      </main>
    </div>
  );  
}

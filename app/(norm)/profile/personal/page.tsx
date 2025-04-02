"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function PersonalProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const t = useTranslations();
  
  // 表單狀態
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    imageUrl: ""
  });
  
  // 載入狀態
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  
  // 從session載入用戶資料
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        bio: (session.user as any)?.bio || "",
        imageUrl: session.user.image || ""
      });
    }
  }, [session]);
  
  // 重定向未登入用戶
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 處理表單變更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", content: "" });
    
    try {
      // 這裡實際應用中應有一個API端點來更新用戶資料
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新session (實際應用中應從API響應更新)
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          bio: formData.bio
        }
      });
      
      setMessage({
        type: "success",
        content: "個人資料已成功更新！"
      });
    } catch (error) {
      setMessage({
        type: "error",
        content: "更新資料時發生錯誤，請稍後再試。"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 模擬頭像上傳
  const handleImageUpload = () => {
    // 實際應用中，這裡應該打開一個文件選擇對話框
    // 然後處理文件上傳到如S3/Cloudinary等服務
    alert("在真實應用中，這裡會打開檔案選擇器並上傳圖片");
  };

  // 如果還在載入或未登入，顯示載入狀態
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700"
        >
          {/* 頂部返回導航 */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <Link href="/profile" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>返回個人資料</span>
            </Link>
          </div>
          
          {/* 表單 */}
          <div className="p-6">
            <div className="flex items-center mb-6">
              <User className="w-5 h-5 text-pink-500 mr-2" />
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">編輯個人資料</h1>
            </div>
            
            {/* 狀態消息 */}
            {message.content && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === "success" 
                  ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {message.content}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 頭像上傳 */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 dark:border-slate-600 mb-2">
                  {formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-pink-400 to-purple-500 text-white text-3xl font-bold">
                      {formData.name?.[0] || "U"}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="absolute bottom-0 right-0 bg-pink-500 text-white rounded-full p-1 shadow-md hover:bg-pink-600 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">點擊相機圖標更換頭像</p>
              </div>
              
              {/* 姓名 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  姓名
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-slate-700 dark:text-white"
                  placeholder="您的姓名"
                  required
                />
              </div>
              
              {/* 電子郵件 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  電子郵件
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-600 text-gray-500 dark:text-gray-400"
                  placeholder="您的電子郵件"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  電子郵件無法直接修改，如需變更請聯繫客服
                </p>
              </div>
              
              {/* 個人簡介 */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  個人簡介
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-slate-700 dark:text-white"
                  placeholder="簡單介紹一下自己..."
                ></textarea>
              </div>
              
              {/* 提交按鈕 */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg shadow-sm hover:from-pink-600 hover:to-violet-600 transition-colors text-sm font-medium ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "儲存中..." : "儲存變更"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
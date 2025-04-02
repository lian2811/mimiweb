"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, Shield, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function SecuritySettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations();
  
  // 密碼表單狀態
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // 兩步驗證狀態
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // 載入狀態
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isTwoFactorLoading, setIsTwoFactorLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", content: "" });
  const [twoFactorMessage, setTwoFactorMessage] = useState({ type: "", content: "" });
  
  // 重定向未登入用戶
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 處理密碼表單變更
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 處理密碼表單提交
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 驗證新密碼
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({
        type: "error",
        content: "新密碼與確認密碼不符"
      });
      return;
    }
    
    // 驗證密碼強度
    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        content: "密碼長度必須至少8個字符"
      });
      return;
    }
    
    setIsPasswordLoading(true);
    setPasswordMessage({ type: "", content: "" });
    
    try {
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功訊息
      setPasswordMessage({
        type: "success",
        content: "密碼已成功更新！"
      });
      
      // 清空表單
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      setPasswordMessage({
        type: "error",
        content: "更新密碼時發生錯誤，請稍後再試。"
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };
  
  // 處理兩步驗證切換
  const handleTwoFactorToggle = async () => {
    setIsTwoFactorLoading(true);
    setTwoFactorMessage({ type: "", content: "" });
    
    try {
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 切換狀態
      const newStatus = !twoFactorEnabled;
      setTwoFactorEnabled(newStatus);
      
      // 成功訊息
      setTwoFactorMessage({
        type: "success",
        content: newStatus 
          ? "兩步驗證已成功啟用！" 
          : "兩步驗證已關閉。"
      });
    } catch (error) {
      setTwoFactorMessage({
        type: "error",
        content: "處理兩步驗證時發生錯誤，請稍後再試。"
      });
    } finally {
      setIsTwoFactorLoading(false);
    }
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
          
          {/* 安全設置 */}
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Lock className="w-5 h-5 text-purple-500 mr-2" />
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">安全設置</h1>
            </div>
            
            {/* 變更密碼 */}
            <div className="mb-8 p-6 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-gray-100 dark:border-slate-600">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">變更密碼</h2>
              
              {/* 密碼變更狀態 */}
              {passwordMessage.content && (
                <div className={`mb-4 p-4 rounded-lg ${
                  passwordMessage.type === "success" 
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {passwordMessage.content}
                </div>
              )}
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* 目前密碼 */}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    目前密碼
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white"
                    placeholder="輸入您的目前密碼"
                    required
                  />
                </div>
                
                {/* 新密碼 */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    新密碼
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white"
                    placeholder="輸入新密碼"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    密碼必須至少8個字符，並包含字母和數字
                  </p>
                </div>
                
                {/* 確認新密碼 */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    確認新密碼
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white"
                    placeholder="再次輸入新密碼"
                    required
                  />
                </div>
                
                {/* 密碼提交按鈕 */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isPasswordLoading}
                    className={`px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-sm hover:from-purple-600 hover:to-indigo-600 transition-colors text-sm font-medium ${
                      isPasswordLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isPasswordLoading ? "更新中..." : "更新密碼"}
                  </button>
                </div>
              </form>
            </div>
            
            {/* 兩步驗證 */}
            <div className="p-6 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-gray-100 dark:border-slate-600">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">兩步驗證</h2>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    id="toggle"
                    className="sr-only"
                    checked={twoFactorEnabled}
                    onChange={handleTwoFactorToggle}
                    disabled={isTwoFactorLoading}
                  />
                  <label
                    htmlFor="toggle"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
                      twoFactorEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-300 ease-in-out ${
                        twoFactorEnabled ? 'translate-x-7' : 'translate-x-0.5'
                      }`}
                      style={{ marginTop: '2px' }}
                    ></span>
                  </label>
                </div>
              </div>
              
              {/* 兩步驗證狀態 */}
              {twoFactorMessage.content && (
                <div className={`mb-4 p-4 rounded-lg ${
                  twoFactorMessage.type === "success" 
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {twoFactorMessage.content}
                </div>
              )}
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                兩步驗證提供額外的安全層級，在登入時除了輸入密碼外，還需要輸入發送到您手機的驗證碼。
              </p>
              
              {twoFactorEnabled ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                        您的帳戶已啟用兩步驗證
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                        每次登入時，系統會傳送一個驗證碼到您的手機。
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                        建議開啟兩步驗證以提高帳戶安全性
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                        啟用後，即使有人知道您的密碼，也無法登入您的帳戶。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 登入歷史 */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">近期登入活動</h3>
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <div className="w-5 h-5 text-green-600 dark:text-green-400">✓</div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">成功登入</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date().toLocaleString()} · 從 Windows Chrome 瀏覽器
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <div className="w-5 h-5 text-green-600 dark:text-green-400">✓</div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">成功登入</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(Date.now() - 86400000).toLocaleString()} · 從 Windows Chrome 瀏覽器
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
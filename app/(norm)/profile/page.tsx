"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, Shield, CreditCard } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // 重定向未登入用戶
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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
          {/* 頂部資料顯示 */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-10">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-pink-400 to-purple-500 text-white text-3xl font-bold">
                    {session?.user?.name?.[0] || "U"}
                  </div>
                )}
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">{session?.user?.name || "用戶"}</h1>
                <p className="text-pink-100">{session?.user?.email}</p>
                <div className="mt-2">
                  <span className="inline-block bg-pink-400/30 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {(session?.user as any)?.role === "admin" ? "管理員" : "一般會員"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 選項卡 */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 帳戶資訊 */}
              <div className="bg-pink-50 dark:bg-slate-700 rounded-xl p-6 transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-pink-500" />
                  <h2 className="ml-2 text-lg font-semibold text-gray-800 dark:text-white">個人資料</h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  管理您的個人資料，例如姓名、照片和隱私設置。
                </p>
                <Link
                  href="/profile/personal"
                  className="inline-flex items-center text-pink-600 dark:text-pink-400 text-sm font-medium hover:underline"
                >
                  編輯個人資料
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </div>

              {/* 安全設置 */}
              <div className="bg-purple-50 dark:bg-slate-700 rounded-xl p-6 transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  <Lock className="w-5 h-5 text-purple-500" />
                  <h2 className="ml-2 text-lg font-semibold text-gray-800 dark:text-white">安全設置</h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  管理您的密碼和帳戶安全設置，啟用兩步驗證。
                </p>
                <Link
                  href="/profile/security"
                  className="inline-flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline"
                >
                  更新安全設置
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </div>

              {/* 付款資訊 */}
              <div className="bg-blue-50 dark:bg-slate-700 rounded-xl p-6 transition-all hover:shadow-md">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  <h2 className="ml-2 text-lg font-semibold text-gray-800 dark:text-white">付款資訊</h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  管理您的付款方式、查看訂閱和付款歷史。
                </p>
                <Link
                  href="/profile/billing"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                >
                  管理付款方式
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>

            {/* 訂閱狀態 */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 rounded-xl shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">目前方案: 免費版</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    升級到進階版獲得更多功能和更高使用限制
                  </p>
                </div>
                <Link
                  href="/subscription"
                  className="mt-4 sm:mt-0 px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg shadow-sm hover:from-pink-600 hover:to-violet-600 transition-colors text-sm font-medium"
                >
                  升級方案
                </Link>
              </div>
            </div>

            {/* 帳戶活動 */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">近期活動</h3>
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">帳戶登入</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date().toLocaleString()} · 從 Windows Chrome 瀏覽器
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">成功註冊</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date().toLocaleString()} · 歡迎加入 MiMi AI
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
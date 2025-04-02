"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, ArrowLeft, PlusCircle, Clock, DollarSign, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations();
  
  // 付款方式狀態
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "pm_1",
      type: "card",
      brand: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
      isDefault: true
    }
  ]);
  
  // 帳單歷史狀態
  const [billingHistory, setBillingHistory] = useState([
    {
      id: "inv_001",
      amount: 3000,
      status: "paid",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      description: "MimiWeb 高級訂閱"
    },
    {
      id: "inv_002",
      amount: 3000,
      status: "pending",
      date: new Date(),
      description: "MimiWeb 高級訂閱"
    }
  ]);
  
  // 新增信用卡表單狀態
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardName: "",
    expDate: "",
    cvc: ""
  });
  
  // 載入狀態
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardMessage, setCardMessage] = useState({ type: "", content: "" });
  
  // 重定向未登入用戶
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 處理卡片表單變更
  const handleCardFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 處理卡片表單提交
  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsAddingCard(true);
    setCardMessage({ type: "", content: "" });
    
    try {
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 添加新卡
      const newCard = {
        id: `pm_${Date.now()}`,
        type: "card",
        brand: "mastercard",
        last4: cardForm.cardNumber.slice(-4),
        expMonth: parseInt(cardForm.expDate.split('/')[0]),
        expYear: parseInt(`20${cardForm.expDate.split('/')[1]}`),
        isDefault: false
      };
      
      setPaymentMethods(prev => [...prev, newCard]);
      setCardMessage({
        type: "success",
        content: "付款方式已成功添加！"
      });
      
      // 清空表單
      setCardForm({
        cardNumber: "",
        cardName: "",
        expDate: "",
        cvc: ""
      });
      
      // 關閉表單
      setTimeout(() => {
        setShowAddCard(false);
      }, 2000);
      
    } catch (error) {
      setCardMessage({
        type: "error",
        content: "添加付款方式時發生錯誤，請稍後再試。"
      });
    } finally {
      setIsAddingCard(false);
    }
  };
  
  // 設為預設付款方式
  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };
  
  // 刪除付款方式
  const deletePaymentMethod = (id: string) => {
    setPaymentMethods(methods => 
      methods.filter(method => method.id !== id)
    );
  };

  // 如果還在載入或未登入，顯示載入狀態
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // 格式化信用卡類型
  const formatCardBrand = (brand: string) => {
    switch (brand) {
      case "visa": return "Visa";
      case "mastercard": return "Mastercard";
      case "amex": return "American Express";
      default: return brand.charAt(0).toUpperCase() + brand.slice(1);
    }
  };
  
  // 格式化金額
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
          
          {/* 付款設置 */}
          <div className="p-6">
            <div className="flex items-center mb-6">
              <CreditCard className="w-5 h-5 text-emerald-500 mr-2" />
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">付款管理</h1>
            </div>
            
            {/* 付款方式 */}
            <div className="mb-8 p-6 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-gray-100 dark:border-slate-600">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">付款方式</h2>
                {!showAddCard && (
                  <button
                    onClick={() => setShowAddCard(true)}
                    className="flex items-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    <span>添加付款方式</span>
                  </button>
                )}
              </div>
              
              {/* 付款方式列表 */}
              {paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map(method => (
                    <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-600 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-8 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center rounded">
                          {method.brand === "visa" ? (
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">VISA</span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400 font-bold text-xs">MC</span>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {formatCardBrand(method.brand)} •••• {method.last4}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            有效期至 {method.expMonth}/{method.expYear}
                            {method.isDefault && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                預設
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!method.isDefault && (
                          <>
                            <button
                              onClick={() => setDefaultPaymentMethod(method.id)}
                              className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                            >
                              設為預設
                            </button>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <button
                              onClick={() => deletePaymentMethod(method.id)}
                              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                            >
                              刪除
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">
                    您尚未添加任何付款方式
                  </p>
                </div>
              )}
              
              {/* 添加新卡表單 */}
              {showAddCard && (
                <div className="mt-6 p-6 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                  <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">添加新卡</h3>
                  
                  {/* 卡片狀態訊息 */}
                  {cardMessage.content && (
                    <div className={`mb-4 p-4 rounded-lg ${
                      cardMessage.type === "success" 
                        ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {cardMessage.content}
                    </div>
                  )}
                  
                  <form onSubmit={handleCardSubmit} className="space-y-4">
                    {/* 卡號 */}
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        卡號
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={cardForm.cardNumber}
                        onChange={handleCardFormChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>
                    
                    {/* 持卡人姓名 */}
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        持卡人姓名
                      </label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={cardForm.cardName}
                        onChange={handleCardFormChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white"
                        placeholder="張三"
                        required
                      />
                    </div>
                    
                    {/* 到期日和CVC號 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          到期日 (MM/YY)
                        </label>
                        <input
                          type="text"
                          id="expDate"
                          name="expDate"
                          value={cardForm.expDate}
                          onChange={handleCardFormChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white"
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          安全碼 (CVC)
                        </label>
                        <input
                          type="text"
                          id="cvc"
                          name="cvc"
                          value={cardForm.cvc}
                          onChange={handleCardFormChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white"
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                    
                    {/* 表單按鈕 */}
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddCard(false)}
                        className="px-4 py-2 bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-slate-500 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        disabled={isAddingCard}
                        className={`px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-sm hover:from-purple-600 hover:to-indigo-600 transition-colors text-sm font-medium ${
                          isAddingCard ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {isAddingCard ? "添加中..." : "添加卡片"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            
            {/* 帳單記錄 */}
            <div className="p-6 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-gray-100 dark:border-slate-600">
              <div className="flex items-center mb-4">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">帳單記錄</h2>
              </div>
              
              {billingHistory.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {billingHistory.map(bill => (
                    <div key={bill.id} className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-slate-600 last:border-0">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-600 flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800 dark:text-white">{bill.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {bill.date.toLocaleDateString()} · {formatAmount(bill.amount)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bill.status === 'paid' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {bill.status === 'paid' ? '已支付' : '處理中'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    您尚無任何帳單記錄
                  </p>
                </div>
              )}
            </div>
            
            {/* 提示信息 */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    付款與帳單問題？
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                    如果您有任何關於付款或帳單的問題，請聯繫我們的客戶支援團隊：support@mimiweb.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
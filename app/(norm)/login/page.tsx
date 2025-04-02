"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import LoginContent from "./LoginContent";

// 定義表單驗證架構
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 使用 NextAuth 的 signIn 方法，明確指定回傳 JSON
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // 不自動重定向，我們自己處理
        callbackUrl: "/" // 明確指定回調URL
      });
      
      if (!result) {
        setError("登入失敗: 服務器無回應");
        return;
      }
      
      if (result.error) {
        setError(`登入失敗: ${result.error}`);
        return;
      }
      
      // 成功登入後導向
      router.push("/");
      router.refresh(); // 重新整理頁面以更新狀態
    } catch (err) {
      // 提供更詳細的錯誤資訊
      console.error("Authentication error details:", err);
      setError(`登入過程中發生錯誤: ${err instanceof Error ? err.message : "未知錯誤"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContent
      isLoading={isLoading}
      error={error}
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      errors={errors}
    />
  );
}
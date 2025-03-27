"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginContent from "./LoginContent";

// 定義表單驗證架構
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split('/')[1];
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 模擬 API 呼叫
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 在真實應用中，這裡會呼叫登入 API
      console.log("登入資料:", data);
      
      // 模擬成功登入後導向
      router.push(`/${locale}`);
    } catch (err) {
      setError("登入失敗，請檢查您的憑證並重試。");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContent
      locale={locale}
      isLoading={isLoading}
      error={error}
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      errors={errors}
    />
  );
}
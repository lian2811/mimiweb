import type { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
  }
}

// 這裡可以連接到你的資料庫進行用戶驗證
// 以下是示範用的驗證邏輯，實際應用中應替換為資料庫查詢
async function authorize(credentials: any) {
  try {
    // 檢查憑證是否完整
    if (!credentials?.email || !credentials?.password) {
      throw new Error("Missing credentials");
    }

    // 模擬資料庫驗證
    if (credentials.email === "user@example.com" && credentials.password === "password") {
      return { 
        id: "1", 
        name: "測試用戶", 
        email: "user@example.com",
        image: "https://ui-avatars.com/api/?name=測試用戶",
        role: "user"
      };
    }
    
    // 明確拋出認證錯誤
    throw new Error("Invalid email or password");
  } catch (error) {
    console.error("Auth error:", error);
    throw error; // 重新拋出錯誤讓 NextAuth 可以處理
  }
}

// 創建NextAuth選項
export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "帳號密碼",
      credentials: {
        email: { label: "電子郵件", type: "email" },
        password: { label: "密碼", type: "password" }
      },
      async authorize(credentials) {
        return await authorize(credentials);
      }
    }),
    
    // 只有在環境變數存在時才添加 Google 提供者
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
          })
        ]
      : []),
    
    // 只有在環境變數存在時才添加 GitHub 提供者
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
          })
        ]
      : [])
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
    newUser: "/register"
  },
  callbacks: {
    jwt({ token, user, account }) {
      // 將使用者資訊加入 JWT
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    session({ session, token }) {
      // 將 JWT 中的資訊加入 session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "user";
      }
      return session;
    }
  },
  // Use a strong secret or fallback with a warning
  secret: process.env.NEXTAUTH_SECRET || "mimi-secret-key",
  // 新增額外的 debug 功能（生產環境可移除）
  debug: process.env.NODE_ENV === "development",
};

// Default export for backwards compatibility
export default authConfig;


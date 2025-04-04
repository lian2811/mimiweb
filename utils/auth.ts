import type { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { mongoPrisma } from "@/lib/mongoPrisma";
import bcrypt from "bcryptjs";

// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
  }
}

// 使用 MongoDB 數據庫進行用戶驗證
async function authorize(credentials: any) {
  try {
    // 檢查憑證是否完整
    if (!credentials?.email || !credentials?.password) {
      throw new Error("Missing credentials");
    }

    // 使用 MongoDB 查找用戶
    const user = await mongoPrisma.mongoUser.findUnique({
      where: { email: credentials.email }
    });

    // 如果用戶不存在
    if (!user) {
      throw new Error("User not found");
    }

    // 比較密碼
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // 返回用戶資訊（不含密碼）
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role
    };
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
    async signIn({ user, account, profile }) {
      // 如果是 OAuth 登入 (Google, GitHub 等)，檢查用戶是否已存在，不存在就創建
      if (account && account.provider !== 'credentials') {
        try {
          const existingUser = await mongoPrisma.mongoUser.findUnique({
            where: { email: user.email! }
          });

          // 如果用戶不存在，創建新用戶
          if (!existingUser && user.email) {
            await mongoPrisma.mongoUser.create({
              data: {
                name: user.name || '',
                email: user.email,
                image: user.image || '',
                password: '', // OAuth 用戶沒有密碼
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date()
              }
            });
          }
        } catch (error) {
          console.error('OAuth 用戶處理錯誤:', error);
          // 繼續登入流程，不阻止用戶登入
        }
      }
      return true;
    },
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


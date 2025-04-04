import NextAuth from "next-auth";
import { authConfig } from "@/utils/auth";

// 确保NextAuth处理程序能正确处理所有可能的错误情况
const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { mongoPrisma } from "@/lib/mongoPrisma";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 基本驗證
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "缺少必要資料" },
        { status: 400 }
      );
    }

    // 檢查用戶是否已存在
    const existingUser = await mongoPrisma.mongoUser.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "此電子郵件已被註冊" },
        { status: 409 }
      );
    }

    // 雜湊密碼
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 創建新用戶
    const newUser = await mongoPrisma.mongoUser.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // 移除密碼後返回用戶資料
    const { password: _password, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: "註冊成功", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("註冊錯誤:", error);
    return NextResponse.json(
      { message: "註冊處理過程中發生錯誤" },
      { status: 500 }
    );
  }
}
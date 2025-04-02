import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// 這裡應導入實際的資料庫模型
// 範例: import { User } from "@/models/User";

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
    // 在實際應用中，這裡應從資料庫檢查
    // 範例: const existingUser = await User.findOne({ email });
    const existingUser = false;

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
    // 在實際應用中，這裡應保存到資料庫
    // 範例: const newUser = await User.create({ name, email, password: hashedPassword });
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    // 移除密碼後返回用戶資料
    const { password: _password, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: "註冊成功", user: userWithoutPassword, _password},
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
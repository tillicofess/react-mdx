import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "./firebaseConfig";
import { http, api } from "../lib/axios";

// 登录
export const signInWithCredentials = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const token = await userCredential.user.getIdToken();
    const res = await http.post("/sso/set-cookie", { token });

    return res.data;
  } catch (error: any) {
    // 打印日志
    console.error("❌ signInWithCredentials error:", error.code);

    // 判断具体错误
    const errorCode = error.code;

    if (errorCode === "auth/invalid-credential") {
      // 抛出用于 UI 的结构化错误
      throw new Error("账号或密码错误");
    }

    throw new Error("登录失败，请稍后再试");
  }
};

interface UserInfo {
  email: string;
  role?: string;
}

// 验证是否登录
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const res = await api.get("/sso/getUserInfo");
    return res.data;
  } catch (error: any) {
    console.error("❌ getUserInfo error:", {
      code: error.response?.data?.code,
      message: error.response?.data?.message,
    });
    return null;
  }
};

// 登出
export const signOut = async () => {
  try {
    const res = await api.post("/sso/logout");
    return res;
  } catch (error: any) {
    console.error("❌ logout error:", {
      code: error.response?.data?.code,
      message: error.response?.data?.message,
    });
    return null;
  }
};

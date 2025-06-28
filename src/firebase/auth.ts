import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "./firebaseConfig";
import { api } from "../lib/axios";

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
    const res = await api.post("/sso/login", { token });
    if (res.code !== 0) {
      throw new Error(res.message);
    }
    return res.data;
  } catch (error: any) {
    const firebaseCode = error.code;
    const firebaseMsg = error.message;

    // 打印日志
    console.error("❌ signInWithCredentials error:", {
      code: firebaseCode,
      message: firebaseMsg,
    });

    switch (firebaseCode) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        throw new Error("账号或密码错误");
      case "auth/too-many-requests":
        throw new Error("登录请求过于频繁，请稍后再试");
      case "auth/network-request-failed":
        throw new Error("网络异常，请检查连接");
      default:
        throw new Error("登录失败，请稍后再试");
    }
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

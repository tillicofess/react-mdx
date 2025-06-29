import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
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
    // 优先处理 Axios/HTTP 错误
    if (error.response) {
      const { status, data } = error.response;
      console.error("❌ API Error:", {
        status,
        data,
        config: error.config,
      });

      if (status > 500) {
        // 匹配所有 5xx 服务器错误，例如数据库崩溃、服务器内部代码错误等
        throw new Error("服务器开小差了，请稍后再试");
      }

      // 尝试从后端返回的 data 中获取错误信息
      const message = data?.message || "请求失败，请稍后再试";
      throw new Error(message);
    }

    // 其次处理 Firebase 客户端认证错误 (error.code 存在)
    if (error.code) {
      const firebaseCode = error.code;
      console.error("❌ Firebase Auth Error:", {
        code: firebaseCode,
        message: error.message,
      });

      switch (firebaseCode) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          throw new Error("账号或密码错误");
        case "auth/too-many-requests":
          throw new Error("登录请求过于频繁，请稍后再试");
        case "auth/network-request-failed":
          throw new Error("网络异常，请检查您的连接");
        default:
          throw new Error("登录认证失败，请稍后再试");
      }
    }

    // 最后处理其他未知错误
    console.error("❌ Unexpected Error:", error);
    throw new Error(error.message || "发生未知错误，请稍后再试");
  }
};

// 注册
export const firebaseSignUp = async (formData: FormData) => {
  const email = formData?.get("email") as string;
  const password = formData?.get("password") as string;
  try {
    const res = await api.post("/sso/register", {
      email,
      password,
    });
    if (res.code !== 0) {
      throw new Error(res.message);
    }
    return res.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("❌ API Error:", {
        status,
        data,
        config: error.config,
      });
      if (status > 500) {
        throw new Error("服务器开小差了，请稍后再试");
      }
      const message = data?.message || "请求失败，请稍后再试";
      throw new Error(message);
    }
    if (error.code) {
      const firebaseCode = error.code;
      console.error("❌ Firebase Auth Error:", {
        code: firebaseCode,
        message: error.message,
      });

      switch (firebaseCode) {
        case "auth/email-already-in-use":
          throw new Error("该邮箱地址已被注册");
        case "auth/weak-password":
          throw new Error("密码强度不足，请使用更复杂的密码");
        case "auth/invalid-email":
          throw new Error("无效的邮箱地址格式");
        case "auth/network-request-failed":
          throw new Error("网络异常，请检查您的连接");
        default:
          throw new Error("注册失败，请稍后再试");
      }
    }

    console.error("❌ Unexpected Error:", error);
    throw new Error(error.message || "发生未知错误，请稍后再试");
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
    await firebaseSignOut(firebaseAuth);
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

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
    return userCredential;
  } catch (error: any) {
    const errorCode = error.code;

    switch (errorCode) {
      case "auth/wrong-password":
        throw new Error("密码错误");
      case "auth/user-not-found":
        throw new Error("用户不存在");
      case "auth/network-request-failed":
        throw new Error("网络异常，请检查您的连接");
      default:
        throw new Error("登录失败，请稍后再试");
    }
  }
};

// 注册
export const signUpWithCredentials = async (
  email: string,
  password: string
) => {
  if (!email || !password) {
    throw new Error("邮箱或密码不能为空");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    await api.post(
      "/sso/register",
      {},
      {
        headers: {
          requiresAuth: true,
        },
      }
    );
    return userCredential;
  } catch (error: any) {
    if (firebaseAuth.currentUser) {
      try {
        await firebaseAuth.currentUser.delete();
        console.log("⚠️ 回滚删除 Firebase 用户成功");
        throw new Error("注册失败：" + (error?.message || "未知错误"));
      } catch (deleteError) {
        console.error("⚠️ 回滚删除 Firebase 用户失败", deleteError);
      }
    }

    // 提示更友好的错误信息
    if (error.code) {
      switch (error.code) {
        case "auth/email-already-in-use":
          throw new Error("该邮箱地址已被注册");
        case "auth/email-already-exists":
          throw new Error("该邮箱地址已被注册");
        case "auth/password-does-not-meet-requirements":
          throw new Error("密码不符合安全策略：需要包含小写字母");
        case "auth/weak-password":
          throw new Error("密码强度不足，请使用更复杂的密码");
        case "auth/invalid-email":
          throw new Error("无效的邮箱地址格式");
        case "auth/network-request-failed":
          throw new Error("网络异常，请检查您的连接");
      }
    }

    throw new Error("注册失败：" + (error?.message || "未知错误"));
  }
};

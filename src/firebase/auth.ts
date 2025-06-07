import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "./firebaseConfig";
import { http } from "../lib/axios";

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

    console.log("Response from /sso/set-cookie:", res.data);
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

// 验证是否登录
export const getUserInfo = async () => {
  try {
    const meResponse = await http.get("/sso/me");
    console.log("User data from /sso/me:", meResponse.data);
    return meResponse.data;
  } catch (error: any) {
    console.error("❌ getUserInfo error:", error.response?.data.code);
  }
};

export const signOut = async () => {
  try {
    const res = await http.post("/sso/logout");
    console.log("Response from /sso//logout:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ signOut error:", error.response?.data.code);
  }
};

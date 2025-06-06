import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "./firebaseConfig";
import { http } from "../lib/axios";

// 登录
export const signInWithCredentials = async (
  email: string,
  password: string
) => {
  const userCredential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );

  const token = await userCredential.user.getIdToken();
  const res = await http.post("/sso/set-cookie", { token });
  console.log("Response from /sso/set-cookie:", res.data);
  return res.data;
};

// 验证是否登录
export const getUserInfo = async () => {
  const meResponse = await http.get("/sso/me");
  console.log("User data from /sso/me:", meResponse.data);
  return meResponse.data;
};

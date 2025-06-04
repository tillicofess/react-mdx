import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "./firebaseConfig";

// 邮箱登录
export async function signInWithCredentials(email: string, password: string) {
  signInWithEmailAndPassword(firebaseAuth, email, password).then(
    async (userCredential) => {
      const token = await userCredential.user.getIdToken();

      // 把 token 交给后端设置 Cookie（使用代理避免跨域问题）
      await fetch("/api/sso/set-cookie", {
        // const result = await fetch("https://ticscreek.top/test/sso/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        credentials: "include", // 必须启用，发送 cookie
      });
    }
  );
}

export async function test() {
  const res = await fetch("/api/sso/me", {
    credentials: "include", // 必须加
  });
  const a = await res.json();

  console.log(a);
}

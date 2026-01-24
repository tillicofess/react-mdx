import { createContext, useContext, useEffect, useState } from "react";
import { type User } from "@/types/auth";
import { getUserInfo, logout, introspect } from "@/apis/ory"

const AuthContext = createContext({
  userInfo: null as User | null,
  isLoggedIn: false,
  state: "",
  signOut: () => { },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [state] = useState("");

  useEffect(() => {
    introspect().then(res => {
      setIsLoggedIn(res);
    })
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      getInfo().then(res => {
        setInfo(res as any);
      });
    }

    // 获取用户信息
    async function getInfo() {
      let res = await getUserInfo();
      return res;
    }

    // 设置用户信息
    function setInfo(res: any) {
      if (res != null) {
        setUserInfo({
          email: res.email,
          name: `${res.name.first}${res.name.last}`,
        });
        setIsLoggedIn(true);
      } else {
        setUserInfo(null);
        setIsLoggedIn(false);
      }
    }
  }, [isLoggedIn]);

  // 退出登录
  function signOut() {
    logout();
  }

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        isLoggedIn,
        state,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
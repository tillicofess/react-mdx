import { createContext, useContext, useEffect, useState } from "react";
import { type User } from "@/types/auth";
import { getUserInfo } from "@/apis/casdoor"

const AuthContext = createContext({
  userInfo: null as User | null,
  isLoggedIn: false,
  signOut: () => { },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getInfo().then(res => {
      setInfo(res as any);
      setIsLoggedIn(true);
    });

    // 获取用户信息
    async function getInfo() {
      let res = await getUserInfo();
      console.log(res.data);
      return res.data;
    }

    // 设置用户信息
    function setInfo(res: any) {
      let userInfo = res.data.user;
      setUserInfo({
        name: userInfo.name,
        avatar: userInfo.avatar,
        email: userInfo.email,
        roles: userInfo.roles,
      });
    }
  }, []);

  // 退出登录
  function signOut() {
    setUserInfo(null);
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        isLoggedIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
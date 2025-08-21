import { createContext, useContext, useEffect, useState } from "react";
import { type User } from "@/types/auth";
import { http } from "@/lib/axios"

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

    async function getInfo() {
      let res = await http.get('/api/user/userinfo');
      console.log(res);
      return res.data;
    }

    function setInfo(res: any) {
      let userInfo = res;
      setUserInfo({
        name: userInfo.name,
        roles: userInfo.roles,
      });
    }
  }, []);

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
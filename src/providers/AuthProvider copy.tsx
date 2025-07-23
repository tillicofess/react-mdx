// 1. React imports
import { createContext, useContext, useEffect, useState } from "react";
import { http } from "@/lib/axios";

// 4. 类型定义：自定义用户
type CustomUser = {
  username: string;
  groups: string[];
};

// 5. 上下文类型（给 TS 提示用）
type AuthContextType = {
  userInfo: CustomUser | null;
};

const AuthContext = createContext<AuthContextType>({
  userInfo: null,

});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<CustomUser | null>(null);

  // 初始化自定义用户
  useEffect(() => {
    const init = async function () {
      console.log('init');
      const response = await http.get('/api/user/profile');
      setUserInfo({
        username: response.data.username,
        groups: response.data.groups,
      });
    }
    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{ userInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

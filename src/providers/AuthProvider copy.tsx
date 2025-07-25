// 1. React imports
import { createContext, useContext, useEffect, useState } from "react";
import { http } from "@/lib/axios";
import { type CustomUser } from "@/types/auth";

// 5. 上下文类型（给 TS 提示用）
type AuthContextType = {
  userInfo: CustomUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  userInfo: null,
  login: async () => { },
  logout: async () => { }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<CustomUser | null>(null);

  const init = async function () {
    try {
      const response = await http.get('/api/user/profile');
      setUserInfo({
        username: response.data.username,
        groups: response.data.groups,
      });
      console.log('用户已登录:', response.data.username);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        console.log('用户未登录或会话过期，userInfo 设置为 null。');
        setUserInfo(null);
      } else {
        console.error('获取用户资料时发生其他错误:', error);
        setUserInfo(null);
      }
    }
  }

  const login = async () => {
    // 这是 Authelia 的认证域名
    const autheliaAuthUrl = 'https://auth.ticscreek.top';
    // 获取 Authelia 提供的重定向 URL（可选，如果你的 Nginx 不会返回 Location 头，就直接用固定的）
    const redirectionUrl = autheliaAuthUrl; // 直接使用 Authelia 域名

    // 添加 `rd` 参数以在登录成功后返回当前页面
    const currentUrl = encodeURIComponent(window.location.href);
    const finalRedirectionUrl = `${redirectionUrl}?rd=${currentUrl}`;

    window.location.href = finalRedirectionUrl; // 执行页面跳转
  }

  const logout = async () => {
    try {
      await http.post('/api/user/logout');
      setUserInfo(null);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    init(); // 组件挂载时执行初始化检查
  }, []);

  return (
    <AuthContext.Provider
      value={{ userInfo, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

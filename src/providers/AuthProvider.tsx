// 1. React imports
import { createContext, useContext, useEffect, useState } from "react";

// 2. Firebase SDK
import {
  getAuth,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";

// 3. 你自己封装的 axios 请求器
import { api } from "@/lib/axios";

// 4. 类型定义：自定义用户
type CustomUser = {
  email: string;
  role: string;
};

// 5. 上下文类型（给 TS 提示用）
type AuthContextType = {
  firebaseUser: FirebaseUser | null;
  customUser: CustomUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  fetchCustomUser: (user: FirebaseUser) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  customUser: null,
  loading: true,
  signOut: async () => {},
  fetchCustomUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomUser = async (user: FirebaseUser) => {
    try {
      const token = await user.getIdToken();
      const res = await api.get<CustomUser>("/sso/getUserInfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomUser(res.data);
    } catch (err) {
      console.error("获取用户信息失败", err);
      setCustomUser(null);
    }
  };

  // 初始化
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(null);
        setCustomUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 初始化自定义用户
  useEffect(() => {
    const init = async () => {
      if (firebaseUser) {
        await fetchCustomUser(firebaseUser);
      }
    };
    init();
  }, [firebaseUser]);

  const signOut = async () => {
    const auth = getAuth();
    await auth.signOut();
    setFirebaseUser(null);
    setCustomUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ firebaseUser, customUser, loading, signOut, fetchCustomUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

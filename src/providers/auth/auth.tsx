import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import keycloak from './keycloak';
import { decodeUser, type KeycloakUser } from './user';

interface AuthContextValue {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: KeycloakUser | null;
  token?: string;
  login: () => void;
  logout: () => void;
  refreshToken: (minValidity?: number) => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isInitialized, setInitialized] = useState(false);
  const [user, setUser] = useState<KeycloakUser | null>(null);
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    keycloak.onAuthLogout = () => {
      setAuthenticated(false);
      setToken(undefined);
      setUser(null);
    };
    
    keycloak
      .init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`,
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        setAuthenticated(authenticated);
        if (authenticated) {
          setToken(keycloak.token);
          setUser(decodeUser(keycloak.token));
        }
        setInitialized(true);
      })
      .catch((err) => {
        console.error("Keycloak init failed", err);
        setInitialized(true); // 即使失败也要允许渲染，否则应用白屏
      });
  }, []);

  const login = () => keycloak.login();

  const logout = () =>
    keycloak.logout({
      redirectUri: window.location.origin,
    });

  const refreshToken = async (minValidity = 30): Promise<string | undefined> => {
    try {
      const refreshed = await keycloak.updateToken(minValidity);
      if (refreshed) {
        setToken(keycloak.token);
        setUser(decodeUser(keycloak.token));
        console.log('Token refreshed successfully');
      }
      return keycloak.token;
    } catch (error) {
      console.error('Failed to refresh token', error);
      // 如果刷新失败，根据业务决定是否强制登出
      // logout(); 
      throw error;
    }
  };

  if (!isInitialized) {
    return <div>Loading...</div>; // 或者返回一个骨架屏
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        user,
        token,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
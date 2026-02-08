import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import keycloak from './keycloak';
import { type KeycloakUser } from './user';
import BouncingLoader from '@/components/gsap-loader';

interface AuthContextValue {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: KeycloakUser | null;
  token?: string;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isInitialized, setInitialized] = useState(false);
  const [user, setUser] = useState<KeycloakUser | null>(null);
  const [token, setToken] = useState<string | undefined>();
  const [showLoader, setShowLoader] = useState(true);
  const exitLoaderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    keycloak.onAuthSuccess = () => {
      setAuthenticated(true);
      if (keycloak.token) {
        setToken(keycloak.token);
        setUser({
          sub: keycloak.tokenParsed?.sub || '',
          preferred_username: keycloak.tokenParsed?.preferred_username || '',
          email: keycloak.tokenParsed?.email || '',
          name: keycloak.tokenParsed?.name || '',
          roles: keycloak.tokenParsed?.resource_access?.['api-backend']?.roles || [],
        });
      }
    };
    keycloak.onAuthLogout = () => {
      setAuthenticated(false);
      setToken(undefined);
      setUser(null);
    };
    keycloak
      .init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`,
        pkceMethod: 'S256'
      })
      .then((authenticated) => {
        if (authenticated && keycloak.token) {
          setAuthenticated(true);
          setToken(keycloak.token);
          setUser({
            sub: keycloak.tokenParsed?.sub || '',
            preferred_username: keycloak.tokenParsed?.preferred_username || '',
            email: keycloak.tokenParsed?.email || '',
            name: keycloak.tokenParsed?.name || '',
            roles: keycloak.tokenParsed?.resource_access?.['api-backend']?.roles || [],
          });
        }
        if (exitLoaderRef.current) {
          exitLoaderRef.current();
        } else {
          setInitialized(true);
          setShowLoader(false);
        }
      })
      .catch((err) => {
        console.error('Keycloak init failed', err);
        // 初始化失败也应触发 loader 消失
        if (exitLoaderRef.current) {
          exitLoaderRef.current();
        } else {
          setInitialized(true);
          setShowLoader(false);
        }
      });
  }, [])

  // 当 Loader 的消失动画真正完成后，才设置 isInitialized
  const handleLoaderExitComplete = useCallback(() => {
    setInitialized(true);
    setShowLoader(false);
  }, []);

  // 接收 loader 提供的退出动画函数
  const registerExitHandler = useCallback((handler: () => void) => {
    exitLoaderRef.current = handler;
  }, []);

  const login = () => keycloak.login();

  const logout = () =>
    keycloak.logout({
      redirectUri: window.location.origin,
    });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        token,
        user,
        login,
        logout,
      }}
    >
      {showLoader && <BouncingLoader onAnimationComplete={handleLoaderExitComplete} onExit={registerExitHandler} />}
      {isInitialized && children} {/* 只有当 Keycloak 初始化且 loader 消失后才渲染子组件 */}
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
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError
} from "axios";
import { getApiConfig } from "../config/env";
import keycloak from "@/providers/auth/keycloak";

// 1. 配置常量
const MAX_RETRY_LIMIT = 3; // 最大重试次数
const RETRY_DELAY = 1000;  // 重试延迟（毫秒）

// 获取当前环境的 API 配置
const apiConfig = getApiConfig();

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  withCredentials: apiConfig.withCredentials,
  headers: {
    "Content-Type": "application/json",
  },
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const successHandler = (response: AxiosResponse) => {
  return response;
};

const errorHandler = async (error: AxiosError) => {
  const config = error.config as InternalAxiosRequestConfig;
  if (!config) return Promise.reject(error);

  // --- 场景 A: 处理 401 Token 过期 (无感刷新) ---
  if (error.response?.status === 401 && !config._retry) {
    config._retry = true; // 标记该请求已经尝试过刷新 Token

    try {
      // minValidity 30s: 如果 token 还有不到 30s 过期，就去刷新
      const refreshed = await keycloak.updateToken(30);

      // 情况 A：刷新成功，或者虽然没请求服务端但当前 Token 依然看起来有效
      if (refreshed || (keycloak.token && !keycloak.isTokenExpired())) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
        return instance(config);
      }

      // 情况 B：逻辑走到这里说明 updateToken 没能换回新 Token
      // 且当前本地 Token 依然判定为失效。这时再重试已无意义。
      return Promise.reject(new Error('Token refresh yielded no valid token'));
    } catch (refreshError) {
      // 刷新失败（Refresh Token 也过期了），通常需重定向至登录
      keycloak.clearToken();
      return Promise.reject(refreshError);
    }
  }

  // --- 场景 B: 实现通用请求最大重试次数 (针对 5xx 或网络错误) ---
  // 逻辑：如果是 5xx 错误且未达到重试上限，则自动重试
  const shouldRetry =
    !error.response || (error.response.status >= 500 && error.response.status <= 599);

  if (shouldRetry) {
    config._retryCount = config._retryCount ?? 0;

    if (config._retryCount < MAX_RETRY_LIMIT) {
      config._retryCount++;
      console.warn(`请求失败，正在进行第 ${config._retryCount} 次重试...`);

      await sleep(RETRY_DELAY);
      return instance(config);
    }
  }

  return Promise.reject(error);
}

// 请求拦截器
instance.interceptors.request.use((config) => {
  if (keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

// 响应拦截器
instance.interceptors.response.use(successHandler, errorHandler);

// 封装常用的 HTTP 方法
export const request = {
  // GET 请求
  get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return instance.get(url, config);
  },

  // POST 请求
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return instance.post(url, data, config);
  },

  // PUT 请求
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return instance.put(url, data, config);
  },

  // DELETE 请求
  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return instance.delete(url, config);
  },

  // PATCH 请求
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return instance.patch(url, data, config);
  },
};

// 导出 axios 实例，以便需要更复杂配置时使用
export default instance;

export const fetcher = (url: string) => request.get(url).then(res => res.data.data);

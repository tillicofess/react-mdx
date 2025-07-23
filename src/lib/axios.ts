import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

import { getApiConfig, isDevelopment } from "../config/env";
import { getAuth } from "firebase/auth";
import { toast } from "sonner";

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

// 请求拦截器
instance.interceptors.request.use(
  async (config) => {
    // 在发送请求之前做些什么
    if (isDevelopment) {
      console.log("🚀 Request sent:", config.method?.toUpperCase(), config.url);
    }

    const requiresAuth = config?.headers?.requiresAuth;

    // 如果不需要身份验证，就跳过加 token
    if (!requiresAuth) {
      return config;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const idToken = await user.getIdToken();
      config.headers.Authorization = `Bearer ${idToken}`;
    } else {
      toast("请先登录");
    }

    // 移除自定义字段，避免发送到后端
    delete config.headers.requiresAuth;
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 2xx 范围内的状态码都会触发该函数
    if (isDevelopment) {
      console.log(
        "✅ Response received:",
        response.status,
        response.config.url
      );
      console.log("Response data:", response.data);
    }
    return response;
  },
  (error) => {
    // 任何超出 2xx 范围的状态码都会触发这个函数
    // 检查错误响应的状态码
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log("收到 401/403 响应，将重定向到 Authelia 登录页...");
      // 获取 Authelia 提供的重定向 URL
      // Nginx 在 401 时会将 Authelia 提供的 Location 头传递给 Axios
      const redirectionUrl = error.response.headers['location'] || 'https://auth.ticscreek.top';

      // 添加 `rd` 参数以在登录成功后返回当前页面
      const currentUrl = encodeURIComponent(window.location.href);
      const finalRedirectionUrl = `${redirectionUrl}?rd=${currentUrl}`;

      // 执行页面跳转
      window.location.href = finalRedirectionUrl;

      // 阻止 Promise 继续向下传递错误，因为我们已经处理了重定向
      return new Promise(() => { }); // 返回一个永远不会 resolve/reject 的 Promise
    }
    // 对于其他错误，继续向下传递
    return Promise.reject(error);
  }
);

// 封装常用的 HTTP 方法
export const http = {
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

// 类型定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

// 封装带有统一响应格式的请求方法
export const api = {
  // GET 请求，返回统一格式
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await http.get<ApiResponse<T>>(url, config);
    return response.data;
  },

  // POST 请求，返回统一格式
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await http.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  // PUT 请求，返回统一格式
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await http.put<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  // DELETE 请求，返回统一格式
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await http.delete<ApiResponse<T>>(url, config);
    return response.data;
  },

  // PATCH 请求，返回统一格式
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await http.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  },
};

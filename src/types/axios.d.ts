import { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * 标识是否为刷新 token 的请求
     */
    __isRefreshToken?: boolean;
    /**
     * 标识是否为获取用户信息的请求
     */
    __isGetUserInfo?: boolean;
  }
}
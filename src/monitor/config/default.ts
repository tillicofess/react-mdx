import type { MonitorConfig } from './type';

export const defaultConfig: Partial<MonitorConfig> = {
  enableError: true,
  enableBehavior: true,
  maxBreadcrumb: 20,
};
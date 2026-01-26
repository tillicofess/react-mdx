export interface MonitorConfig {
  appName: string;
  version: string;
  reportUrl: string;
  maxBreadcrumb?: number;

  enableError?: boolean;
  enableBehavior?: boolean;
}
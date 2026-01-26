import { defaultConfig } from './default';
import type { MonitorConfig } from './type';

let config: MonitorConfig;

export function setConfig(userConfig: MonitorConfig) {
    config = {
        ...defaultConfig,
        ...userConfig,
    } as MonitorConfig;
}

export function getConfig(): MonitorConfig {
    if (!config) {
        throw new Error('[Monitor] config not initialized, call initMonitor first.');
    }
    return config;
}
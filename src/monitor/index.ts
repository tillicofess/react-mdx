import { initBehavior } from './behavior/init';
import { initError } from './error/init';
import { initPerformance } from './performance/init';
import { setConfig, getConfig } from './config/index';
import type { MonitorUserConfig } from './config/type';

let inited = false;

export default function initMonitor(userOptions: MonitorUserConfig) {
    if (inited) return;
    inited = true;

    // 1. 全局配置
    setConfig(userOptions);
    const config = getConfig();

    // 1. 初始化行为采集器
    if (config.enableBehavior !== false) {
        initBehavior();
    }

    // 2. 初始化错误采集器
    if (config.enableError !== false) {
        initError();
    }

    // 3. 初始化性能采集器
    if (config.enablePerformance !== false) {
        initPerformance();
    }

    console.log('[Monitor SDK] initialized', config);
}
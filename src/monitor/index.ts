import { initBehavior } from './behavior/init';
import { initError } from './error/init';
import { setConfig } from './config/index';
import type { MonitorConfig } from './config/type';

let inited = false;

export default function initMonitor(options: MonitorConfig) {
    if (inited) return;
    inited = true;

    // 1. 全局配置
    setConfig(options);


    // 1. 初始化行为采集器
    if (options.enableBehavior !== false) {
        initBehavior();
    }

    // 2. 初始化错误采集器
    if (options.enableError !== false) {
        initError();
    }

    console.log('[Monitor SDK] initialized', options);
}
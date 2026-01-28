// performance/init.ts
import { eventBus } from '../utils/eventBus';
import { report } from '../report';
import type { PerformanceMetrics } from './type';
import fidObserver from './observerFID';
import fcpObserver from './observerFCP';
import { startCLS, stopCLSAndReport } from './observerCLS';
import { startLCP, stopLCPAndReport } from './observerLCP';
import { listenRouteChange } from '../utils/router';
import { getConfig } from '../config/index';
import { formatTime } from '../utils/day';

let inited = false;

export function initPerformance() {
  if (inited) return;
  inited = true;

  // 订阅性能指标事件，上报
  eventBus.on('performance', (metrics: PerformanceMetrics) => {
    const payload = {
      ...metrics,
      version: getConfig().version,
      time: formatTime(new Date()),
    };
    report(payload);
  });

  // 初始化性能指标采集器
  fidObserver();
  fcpObserver();

  startCLS();
  startLCP();

  listenRouteChange(() => {
    stopCLSAndReport();
    stopLCPAndReport();

    startCLS();
    startLCP();
  });

  window.addEventListener('beforeunload', () => {
    stopCLSAndReport();
    stopLCPAndReport();
  });
}

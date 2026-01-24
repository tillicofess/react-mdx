// 错误上报
import { breadcrumb } from './breadcrumb';
import formatTime from '@/utils/utils';
import { eventsMatrix } from '@/main';
import { request } from '@/lib/axios';
import { type MonitorError } from '@/types/monitor';

const APP_VERSION = import.meta.env.VITE_APP_VERSION;
export const REPORT_URL = '/api/logs';

export async function reportError(error: MonitorError) {
    // 🚫 开发环境不上报
    // if (process.env.NODE_ENV === 'development') return;

    // 资源错误不需要录制用户行为录像
    const needEvents = error.category !== 'resource';
    
    let events: any[] = [];

    if (needEvents) {
        const len = eventsMatrix.length;
        if (len >= 2) {
            events = eventsMatrix[len - 2].concat(eventsMatrix[len - 1]);
        } else {
            events = eventsMatrix[len - 1] || [];
        }
    }

    const payload = {
        error,
        actions: breadcrumb.getStack(),
        events,
        time: formatTime(new Date()),
        version: APP_VERSION,
    };

    try {
        await request.post('https://api.ticscreek.top/errorLogs/create', payload);
    } catch (e) {
        console.warn('错误上报失败:', e);
    } finally {
        breadcrumb.clear();
    }
}


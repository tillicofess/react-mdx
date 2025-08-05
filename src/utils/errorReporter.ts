// src/utils/errorReporter.ts
import ErrorStackParser from 'error-stack-parser';
import { breadcrumb } from './breadcrumb';
import formatTime from '@/utils/utils';
import { eventsMatrix } from '@/main';
import { http } from '@/lib/axios';

const maxRetries = 3;

export function reportError(error: Error | string, retryCount = 0) {

    setTimeout(async () => {
        let structuredError: any = {};
        let isResourceError = false;

        // 判断是否为资源错误
        if (typeof error === 'string') {
            structuredError.message = error;
            isResourceError = true;
        } else {
            structuredError.message = error.message;

            try {
                const stackFrames = ErrorStackParser.parse(error);
                if (stackFrames.length > 0) {
                    const top = stackFrames[0];
                    structuredError.fileName = top.fileName;
                    structuredError.line = top.lineNumber;
                    structuredError.column = top.columnNumber;
                    structuredError.functionName = top.functionName;
                }
            } catch (e) {
                console.warn('解析堆栈失败:', e);
            }
        }


        let events: any[] = [];
        if (!isResourceError) {
            const len = eventsMatrix.length;
            if (len > 2) {
                events = eventsMatrix[len - 2].concat(eventsMatrix[len - 1]);
            } else {
                events = eventsMatrix[len - 1] || [];
            }
        }

        const payload = {
            error: structuredError,
            actions: breadcrumb.getStack(),
            events,
            time: formatTime(new Date()),
        };

        try {
            const response = await http.post('/api/logs', payload);
            const result = response.data;
            if (!result.success) {
                retryCount++;
                if (retryCount > maxRetries) {
                    console.warn('Max retries reached, dropping logs');
                    breadcrumb.clear();
                    return; // 终止递归调用
                }
                const delay = Math.pow(2, retryCount) * 1000;
                setTimeout(() => {
                    reportError(error, retryCount);
                }, delay);
            } else {
                breadcrumb.clear();
            }
        } catch (e) {
            console.warn('上报错误失败:', e);
        }
    }, 1000);
}


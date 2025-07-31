import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { http } from "@/lib/axios"
import { loadSourceMap } from "@/utils/sourceMap";
import sourceMap from 'source-map-js';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';
import * as rrweb from 'rrweb';

export default function ErrorPage() {
    const playerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        return () => {
            if (playerRef.current) {
                playerRef.current.innerHTML = "";
            }
        };
    }, []);

    const handleCodeError = () => {
        throw new TypeError('模拟同步代码错误');
    }

    // 示例2: 模拟语法错误 (无法被 try...catch 捕获，但可被 ErrorBoundary 捕获)
    // 原始的 `const notdefined,` 是一个编译时语法错误，它会阻止整个脚本的解析和运行，
    // 因此 `try...catch` 和 `ErrorBoundary` 都无法捕获它。
    // 这里我们模拟一个在事件处理函数中抛出，并会冒泡到 React 渲染树的错误，
    // 从而被 ErrorBoundary 捕获。
    const handleRenderError = () => {
        throw new SyntaxError("模拟语法错误");
    };

    // 示例3: 异步错误 (try...catch 需在异步操作内部 window.onerror捕获)
    // `try...catch` 无法捕获异步回调（如 setTimeout）外部的错误。
    // 错误必须在异步操作的回调函数内部进行捕获。
    const handleAsyncError = () => {
        setTimeout(() => {
            throw new TypeError('模拟异步代码错误');
        }, 0)
    }


    // 示例4: Promise 错误 (window.onunhandledrejection捕获)
    // 如果使用async/await 使得 Promise 的拒绝可以像同步错误一样被 try...catch 捕获。
    const handlePromiseError = () => {
        try {
            new Promise<void>((resolve) => {
                JSON.parse('');
                resolve();
            });
        } catch (err) {
            // try/catch 不能捕获Promise中错误 ❌
            console.error('in try catch', err);
        }

    }

    // 示例5: 接口错误 (try...catch 需在异步操作内部)
    const handleApiError = async () => {
        try {
            await http.get('/api/null');
        } catch (e) {
            console.log(e);
        }
    }

    const findCodeBySourceMap = async () => {
        const { error } = JSON.parse(localStorage.getItem('errorList') || '{}');
        const { fileName, line, column } = error;
        console.log(fileName, line, column);
        let sourceData = await loadSourceMap(fileName);
        console.log(sourceData);
        let { sourcesContent, sources } = sourceData as sourceMap.RawSourceMap;
        let consumer = await new sourceMap.SourceMapConsumer(sourceData as sourceMap.RawSourceMap);
        let result = consumer.originalPositionFor({
            line: Number(line),
            column: Number(column)
        });
        console.log(result);
        let code = sourcesContent?.[sources.indexOf(result.source)] ?? '';
        if (code) {
            // 将代码按行分割为数组
            let lines = code.split('\n');

            // 获取报错行号（result.line）对应的代码
            let errorLine = result.line - 1;  // 注意源代码的行号是从 1 开始的，数组索引是从 0 开始的，所以要减去 1
            let contextLines = 10; // 获取报错行前后各 3 行（可以根据需要调整）

            // 取报错行及前后几行代码
            let start = Math.max(0, errorLine - contextLines); // 确保开始行不小于 0
            let end = Math.min(lines.length, errorLine + contextLines + 1); // 确保结束行不超过总行数

            // 获取报错位置附近的代码段
            let codeSnippet = lines.slice(start, end).join('\n');

            // 打印报错的代码段
            console.log('报错代码段:\n', codeSnippet);
        }
    }

    const handlePlayReplay = () => {
        const errorPayload = JSON.parse(localStorage.getItem("errorList") || "{}");
        const events = errorPayload.events;

        if (!events || events.length === 0) {
            console.warn("没有可回放的 rrwebEvents");
            return;
        }

        if (playerRef.current) {
            // 清空旧内容（避免重复渲染）
            playerRef.current.innerHTML = "";

            // 初始化 rrweb 播放器
            new rrwebPlayer({
                target: playerRef.current,
                props: {
                    events,
                    width: 800,
                    height: 500,
                    autoPlay: true,
                    UNSAFE_replayCanvas: true,
                    unpackFn: rrweb.unpack
                },
            });
        }
    };

    return (
        <>
            <div>
                <Button variant="outline" onClick={handleCodeError}>同步错误</Button>
                <Button variant="outline" onClick={handleRenderError}>语法错误</Button>
                <Button variant="outline" onClick={handleAsyncError}>异步错误</Button>
                <Button variant="outline" onClick={handlePromiseError}>promise错误</Button>
                <Button variant="outline" onClick={handleApiError}>接口错误</Button>
                <Button variant="outline">资源加载错误</Button>
                <Button variant="outline" onClick={findCodeBySourceMap}>获取源码错误</Button>
                <Button variant="outline" onClick={handlePlayReplay}>▶️ 回放用户操作</Button>
                {/* <img src="https://test.cn/×××.png"></img> */}
            </div>
            <div ref={playerRef}></div>
        </>
    );
}
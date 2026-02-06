import { Button } from "@/components/ui/button";
import { request } from "@/lib/axios";


export default function ErrorPage() {

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
    Promise.reject(new Error('message'))
  }

  // 示例5: 接口错误 (try...catch 需在异步操作内部)
  const handleApiError = async () => {
    try {
      await request.get('/api/null');
    } catch (e) {
      console.log(e);
    }
  }

  const protectApiTest = async () => {
    try {
      await request.delete('/api/admin/post/123');
    } catch (e) {
      console.log(e);
    }
  }


  return (
    <>
      <div>
        <Button variant="outline" onClick={handleCodeError}>同步错误</Button>
        <Button variant="outline" onClick={handleRenderError}>语法错误</Button>
        <Button variant="outline" onClick={handleAsyncError}>异步错误</Button>
        <Button variant="outline" onClick={handlePromiseError}>promise错误</Button>
        <Button variant="outline" onClick={handleApiError}>接口错误</Button>
        <Button variant="outline">资源加载错误</Button>
        <Button variant="outline" onClick={protectApiTest}>测试保护接口</Button>
        {/* <img src="https://xxx,com"></img> */}
      </div>
    </>
  );
}
import { Button } from "@/components/ui/button";
import { http } from "@/lib/axios";
import { refreshAccessToken } from "@/apis/casdoor";


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

  const handleGetUserInfo = async () => {
    try {
      let res = await http.get('/api/user/userinfo');
      console.log(res.data);
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
        <Button variant="outline" onClick={handleGetUserInfo}>测试token刷新接口</Button>
        <Button variant="outline" onClick={async () => {
          await refreshAccessToken()
        }}>刷新token</Button>
      </div>
    </>
  );
}

// import * as Setting from "@/features/auth/Setting";
// import { SilentSignin, isSilentSigninRequired } from "casdoor-react-sdk";

// function HomePage() {
//   const isLoggedIn = () => {
//     return localStorage.getItem("token") !== null;
//   };

//   if (isSilentSigninRequired()) {
//     // if the `silentSignin` parameter exists, perform silent login processing
//     return (
//       <SilentSignin
//         sdk={Setting.CasdoorSDK}
//         isLoggedIn={isLoggedIn}
//         handleReceivedSilentSigninSuccessEvent={() => {
//           // jump to the home page here and clear silentSignin parameter
//           window.location.href = "/";
//         }}
//         handleReceivedSilentSigninFailureEvent={() => {
//           // prompt the user to log in failed here
//           alert("login failed");
//         }}
//       />
//     );
//   }

//   const renderContent = () => {
//     if (isLoggedIn()) {
//       return <div>Hello!</div>;
//     } else {
//       return <div>you are not logged in</div>;
//     }
//   };

//   return renderContent();
// }

// export default HomePage;
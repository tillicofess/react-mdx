import { cn } from "@/lib/utils";
import Header from "@/features/profile/header";
import Accordions from "@/features/profile/components/accordion";
import { TeckStack } from "@/features/profile/components/teck-stack";
import Blog from "@/features/blog/components";

function Pattern() {
  return (
    <div
      className={cn(
        "relative flex h-4 w-full border-x border-grid",
        "before:absolute before:-left-[100vw] before:h-4 before:w-[200vw]",
        "before:bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:[--pattern-foreground:var(--color-black)]/5 dark:before:[--pattern-foreground:var(--color-white)]/5"
      )}
    />
  );
}

function App() {

  window.addEventListener('load', () => {
    const pageLoadTime = performance.now();
    console.log(`Page load time: ${pageLoadTime}ms`);
  })

  // const resource = getResource();
  // console.log(resource);


  // function getResource() {
  //   if (performance.getEntriesByType) {
  //     const entries = performance.getEntriesByType('resource');
  //     // 过滤掉非静态资源的 fetch、 xmlhttprequest、beacon
  //     let list = entries.filter((entry) => {
  //       return ['fetch', 'xmlhttprequest', 'beacon'].indexOf((entry as PerformanceResourceTiming).initiatorType) === -1;
  //     });

  //     if (list.length) {
  //       list = JSON.parse(JSON.stringify(list));
  //       list.forEach((entry) => {
  //         (entry as any).isCache = isCache(entry as PerformanceResourceTiming);
  //       });
  //     }
  //     return list;
  //   }
  // }

  // // 判断资料是否来自缓存
  // // transferSize为0，说明是从缓存中直接读取的（强制缓存）
  // // transferSize不为0，但是`encodedBodySize` 字段为 0，说明它走的是协商缓存（`encodedBodySize 表示请求响应数据 body 的大小`）
  // function isCache(entry: PerformanceResourceTiming) {
  //   return entry.transferSize === 0 || (entry.transferSize !== 0 && entry.encodedBodySize === 0);
  // }

  // const entryHandler = (list: any) => {
  //   for (const long of list.getEntries()) {
  //     // 获取长任务详情
  //     console.log(long);
  //   }
  // };

  // let observer = new PerformanceObserver(entryHandler);
  // observer.observe({ entryTypes: ['longtask'] });

  return (
    <div className="max-w-screen overflow-x-hidden">
      <div className="mx-auto px-4 md:max-w-3xl">
        <Header />
        <Pattern />

        <TeckStack />
        <Pattern />

        <Accordions />
        <Pattern />

        <Blog />
        <Pattern />
      </div>
    </div>
  );
}

export default App;

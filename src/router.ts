import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import Blog from "./pages/blog.tsx";
import BlogDetail from "./pages/blogDetail.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/blog",
    Component: Blog,
  },
  {
    path: "/blog/:slug", // 这里使用:slug作为动态参数
    Component: BlogDetail, // 这里使用BlogDetail组件来渲染博客详情页
  },
]);

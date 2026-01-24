import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";

// 使用动态导入提高首屏性能
import App from "./App.tsx";
const Blog = lazy(() => import("./pages/blog/blog.tsx"));
const BlogDetail = lazy(() => import("./pages/blog/blogDetail.tsx"));
const DetailLayout = lazy(() => import("./pages/blog/layout.tsx"));
const ErrorPage = lazy(() => import("./pages/error/index.tsx"));
const Callback = lazy(() => import("./pages/auth/CallBack.tsx"));

export const router = createBrowserRouter([
  {
    path: "/callback",
    element: (
      <Suspense fallback={<div>Loading Callback...</div>}>
        <Callback />
      </Suspense>
    ),
  },
  {
    path: "/",
    Component: App,
  },
  {
    Component: DetailLayout,
    children: [
      {
        path: "/blog",
        element: (
          <Suspense fallback={<div>Loading Blog...</div>}>
            <Blog />
          </Suspense>
        ),
      },
      {
        path: "/blog/:slug",
        element: (
          <Suspense fallback={<div>Loading Blog Detail...</div>}>
            <BlogDetail />
          </Suspense>
        ),
      },
      {
        path: "/error",
        element: (
          <Suspense fallback={<div>Loading Error Page...</div>}>
            <ErrorPage />
          </Suspense>
        ),
      },
    ],
  },
]);

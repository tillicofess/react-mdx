import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import Blog from "./pages/blog/blog.tsx";
import BlogDetail from "./pages/blog/blogDetail.tsx";
import DetailLayout from "./pages/blog/layout.tsx";
import ErrorPage from "./pages/error/index.tsx";
import Callback from "./pages/auth/CallBack.tsx";

export const router = createBrowserRouter([
  {
    path: "/callback",
    Component: Callback,
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
        Component: Blog,
      },
      {
        path: "/blog/:slug",
        Component: BlogDetail,
      },
      {
        path: "/error",
        Component: ErrorPage,
      },
    ],
  },

]);

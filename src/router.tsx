import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import Login from "./pages/user/login.tsx";
import Blog from "./pages/blog/blog.tsx";
import BlogDetail from "./pages/blog/blogDetail.tsx";
import DetailLayout from "./pages/blog/layout.tsx";
import ErrorPage from "./pages/error/index.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/login",
    Component: Login,
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

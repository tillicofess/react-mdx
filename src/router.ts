import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import Blog from "./pages/blog/blog.tsx";
import BlogDetail from "./pages/blog/blogDetail.tsx";
import DetailLayout from "./pages/blog/layout.tsx";

export const router = createBrowserRouter([
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
    ],
  },
]);

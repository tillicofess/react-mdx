import { createHighlighter } from "shiki";
import type { Element } from "hast";

// ✅ 提前初始化一次，防止 evaluate 时重复构建
const highlighterPromise = createHighlighter({
  themes: ["github-dark"], // 仅加载一个主题
  langs: ["js","tsx", "ts", "bash", "json", "html", "css", "md"], // 只加载这些语言
});

export const rehypePrettyCodeOptions = {
  theme: "github-dark",
  keepBackground: false,
  getHighlighter: async () => await highlighterPromise, // ✨ 关键：复用单例 highlighter
  onVisitLine(node: Element) {
    // 防止空行塌陷
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
};

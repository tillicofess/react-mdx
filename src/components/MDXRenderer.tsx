import React, { useState, useEffect } from "react";
// 核心依赖
import { evaluate } from "@mdx-js/mdx";
import { MDXProvider } from "@mdx-js/react";
import * as runtime from "react/jsx-runtime";
import * as provider from "@mdx-js/react";

// MDX 插件
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";
import { rehypeNpmCommand } from "@/lib/rehype-npm-command";
import rehypePrettyCode from "rehype-pretty-code";

// AST 工具
import { visit } from "unist-util-visit";
import type { Element } from "hast";

// 样式与工具
import { components } from "./MdxComponents";
import { Prose } from "@/components/ui/typography";
import { getCachedMDXComponent, setCachedMDXComponent } from "@/utils/mdxCache";


interface MDXRendererProps {
  id: string,
  mdxContent: string;
}

const MDXRenderer: React.FC<MDXRendererProps> = ({ id, mdxContent }) => {
  const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const compileMDX = async () => {
      try {
        setError(null);

        // 检查缓存中是否已有编译好的组件
        const cachedComponent = getCachedMDXComponent(id);
        if (cachedComponent) {
          setMDXContent(() => cachedComponent);
          return;
        }

        const t0 = performance.now();
        // 使用evaluate方法编译MDX内容
        const { default: Component } = await evaluate(mdxContent, {
          ...provider,
          ...runtime,
          remarkPlugins: [
            // 支持GFM语法
            remarkGfm,
          ],
          // 添加 data-language
          rehypePlugins: [
            // 自动为外链添加 target/rel 属性
            [
              rehypeExternalLinks,
              { target: "_blank", rel: "nofollow noopener noreferrer" },
            ],
            
            // 提取原始字符串
            () => (tree) => {
              visit(tree, (node) => {
                if (node?.type === "element" && node?.tagName === "pre") {
                  const [codeEl] = node.children;
                  if (codeEl.tagName !== "code") {
                    return;
                  }

                  node.__rawString__ = codeEl.children?.[0].value;
                  // console.log("Raw string extracted:", node.__rawString__);
                }
              });
            },

            [
              rehypePrettyCode,
              {
                theme: "github-dark",
                keepBackground: false,
                onVisitLine(node: Element) {
                  // prevent empty lines from collapsing
                  if (node.children.length === 0) {
                    node.children = [{ type: "text", value: " " }];
                  }
                },
              },
            ],

            // 提取代码块元数据
            () => (tree) => {
              visit(tree, (node) => {
                if (node?.type === "element" && node?.tagName === "figure") {
                  if (!("data-rehype-pretty-code-figure" in node.properties)) {
                    return;
                  }

                  const preElement = node.children.at(-1);
                  // console.log("preElement:", { preElement });
                  if (preElement.tagName !== "pre") {
                    return;
                  }
                  // console.log("node:", { node });
                  preElement.properties["__withMeta__"] =
                    node.children.at(0).tagName === "figcaption";
                  preElement.properties["__rawString__"] = node.__rawString__;
                }
              });
            },

            rehypeNpmCommand,
          ],
          development: false,
        });
        const t1 = performance.now();
        console.log(`[MDX] compiled ${mdxContent.length} chars in ${(t1 - t0).toFixed(1)} ms`);
        // 缓存编译后的组件
        setCachedMDXComponent(id, Component);
        setMDXContent(() => Component);
      } catch (err) {
        console.error("MDX compilation error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    if (mdxContent) {
      compileMDX();
    }
  }, [id, mdxContent]);

  if (error) {
    return (
      <div style={{ color: "red", padding: "1rem", border: "1px solid red" }}>
        <h3>MDX Compilation Error:</h3>
        <pre>{error}</pre>
      </div>
    );
  }

  if (!MDXContent) {
    return <div>No content to display</div>;
  }

  return (
    <Prose>
      <MDXProvider components={components}>
        <MDXContent />
      </MDXProvider>
    </Prose>
  );
};

export default MDXRenderer;

import React, { useState, useEffect } from "react";
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";
import { MDXProvider } from "@mdx-js/react";
import * as runtime from "react/jsx-runtime";
import * as provider from "@mdx-js/react";
import { components } from "./MdxComponents";
import type { Element } from "hast";
import { Prose } from "@/components/ui/typography";
import { rehypeNpmCommand } from "@/lib/rehype-npm-command";
import rehypeExternalLinks from "rehype-external-links";

interface MDXRendererProps {
  mdxContent: string;
}

const MDXRenderer: React.FC<MDXRendererProps> = ({ mdxContent }) => {
  const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const compileMDX = async () => {
      try {
        setError(null);

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

        setMDXContent(() => Component);
      } catch (err) {
        console.error("MDX compilation error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
      }
    };

    if (mdxContent) {
      compileMDX();
    }
  }, [mdxContent]);

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

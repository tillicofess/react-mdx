import React, { useState, useEffect } from "react";
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from "rehype-pretty-code";
import { MDXProvider } from "@mdx-js/react";
import * as runtime from "react/jsx-runtime";
import * as provider from "@mdx-js/react";
import { components } from "./MdxComponents";
import type { Element } from "hast";
import { Prose } from "@/components/ui/typography";

interface MDXRendererProps {
  mdxContent: string;
}

const MDXRenderer: React.FC<MDXRendererProps> = ({ mdxContent }) => {
  const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const compileMDX = async () => {
      try {
        setLoading(true);
        setError(null);

        // 使用evaluate方法编译MDX内容
        const { default: Component } = await evaluate(mdxContent, {
          ...provider,
          ...runtime,
          remarkPlugins: [remarkGfm],
          // 添加 data-language
          rehypePlugins: [
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
          ],
          development: false,
        });

        setMDXContent(() => Component);
      } catch (err) {
        console.error("MDX compilation error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (mdxContent) {
      compileMDX();
    }
  }, [mdxContent]);

  if (loading) {
    return <div>Loading MDX content...</div>;
  }

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
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
          <MDXContent />
        </div>
      </MDXProvider>
    </Prose>
  );
};

export default MDXRenderer;

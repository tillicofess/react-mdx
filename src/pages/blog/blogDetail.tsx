import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { ChevronLeftIcon } from "lucide-react";
import { Link } from "react-router";
import dayjs from "dayjs";

import { loadMDXFile, parseFrontmatter } from "@/utils/mdxLoader";
import MDXRenderer from "@/components/MDXRenderer";
import { Button } from "@/components/ui/button";
import { Prose } from "@/components/ui/typography";

function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [error, setError] = useState<string | null>(null);
  const [mdxContent, setMdxContent] = useState<string>("");
  const [frontmatter, setFrontmatter] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadContent = async () => {
      try {
        setError(null);
        const rawContent = await loadMDXFile(slug || "");
        const { frontmatter: fm, content } = parseFrontmatter(rawContent);

        setFrontmatter(fm);
        setMdxContent(content);
      } catch (err) {
        console.error("Error loading MDX content:", err);
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
      }
    };

    loadContent();
  }, []);

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <h2>Error Loading Content</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* {frontmatter.title && (
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto 2rem",
            padding: "1rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "0.5rem",
            border: "1px solid #e9ecef",
          }}
        >
          <h2 style={{ margin: "0 0 0.5rem", color: "#495057" }}>文档信息</h2>
          <p>
            <strong>标题:</strong> {frontmatter.title}
          </p>
          {frontmatter.description && (
            <p>
              <strong>描述:</strong> {frontmatter.description}
            </p>
          )}
          {frontmatter.createdAt && (
            <p>
              <strong>创建时间:</strong> {frontmatter.createdAt}
            </p>
          )}
          {frontmatter.updatedAt && (
            <p>
              <strong>更新时间:</strong> {frontmatter.updatedAt}
            </p>
          )}
        </div>
      )} */}

      <div className="screen-line-after flex pb-4">
        <Button variant="link" className="px-2 text-base" asChild>
          <Link to="/blog">
            <ChevronLeftIcon className="size-5" />
            Blog
          </Link>
        </Button>
      </div>

      <div className="screen-line-after px-4 py-1">
        <time
          className="font-mono text-sm text-muted-foreground"
          dateTime={dayjs(frontmatter.createdAt).toISOString()}
        >
          {dayjs(frontmatter.createdAt).format("YYYY.MM.DD")}
        </time>
      </div>

      <Prose className="px-4">
        <div className="screen-line-after">
          <h1 className="mb-6 font-heading font-medium">{frontmatter.title}</h1>
        </div>

        <div className="screen-line-before">
          <p className="lead mt-0 pt-1">{frontmatter.description}</p>
        </div>

        <div>
          <MDXRenderer mdxContent={mdxContent} />
        </div>
      </Prose>
    </>
  );
}

export default BlogDetail;

import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { loadMDXFile, parseFrontmatter } from "@/utils/mdxLoader";
import MDXRenderer from "@/components/MDXRenderer";

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
    <div className="App">
      <header
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "2rem",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <h1>React MDX Runtime Demo</h1>
        <p>运行时编译和渲染MDX内容</p>
      </header>

      {frontmatter.title && (
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
      )}

      <MDXRenderer mdxContent={mdxContent} />
    </div>
  );
}

export default BlogDetail;

import { useState, useEffect } from "react";
import MDXRenderer from "./components/MDXRenderer";
import MDXFileSelector from "./components/MDXFileSelector";
import { loadMDXFile, parseFrontmatter } from "./utils/mdxLoader";

function App() {
  const [currentFile, setCurrentFile] = useState<string>(
    "/src/mdx/content/welcome.mdx"
  );
  const [mdxContent, setMdxContent] = useState<string>("");
  const [frontmatter, setFrontmatter] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setError(null);

        // 读取MDX文件内容
        const rawContent = await loadMDXFile(currentFile);
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
  }, [currentFile]);

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

      <MDXFileSelector
        currentFile={currentFile}
        onFileChange={setCurrentFile}
      />

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

      <footer
        style={{
          textAlign: "center",
          padding: "2rem",
          marginTop: "2rem",
          borderTop: "1px solid #e9ecef",
          color: "#6c757d",
        }}
      >
        <p>使用 @mdx-js/mdx 和 @mdx-js/react 实现运行时MDX编译</p>
      </footer>
    </div>
  );
}

export default App;

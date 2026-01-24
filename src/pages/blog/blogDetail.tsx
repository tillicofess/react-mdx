import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { ChevronLeftIcon } from "lucide-react";
import { Link } from "react-router";
import dayjs from "dayjs";
import { parseFrontmatter, loadMDXFromBackend } from "@/utils/mdxLoader";
import { getCachedMDX, setCachedMDX } from "@/utils/mdxCache";
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
        // 从缓存中获取内容
        const cached = getCachedMDX(slug as string);
        if (cached) {
          setFrontmatter(cached.frontmatter);
          setMdxContent(cached.content);
          return;
        }

        // 从后端加载内容
        const rawContent = await loadMDXFromBackend(slug as string);

        // 解析frontmatter
        const { frontmatter: fm, content } = parseFrontmatter(rawContent);

        setFrontmatter(fm as Record<string, any>);
        setMdxContent(content);

        setCachedMDX(slug as string, { frontmatter: fm as Record<string, any>, content });
      } catch (err) {
        console.error("Error loading MDX content:", err);
        setError(err instanceof Error ? err.message : "Failed to load content");
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
          <MDXRenderer slug={slug as string} mdxContent={mdxContent} />
        </div>
      </Prose>
    </>
  );
}

export default BlogDetail;

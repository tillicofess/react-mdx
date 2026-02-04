import fm from 'front-matter';
import { request } from "@/lib/axios"

// 读取MDX文件内容的工具函数
// ⚠️ NOTE: 仅用于本地开发调试，生产环境需替换为服务端接口请求
export const loadMDXFile = async (slug: string): Promise<string> => {
  try {
    // 使用动态import来加载MDX文件作为文本
    let content: string;

    if (slug.includes("welcome")) {
      const module = await import("../mdx/content/welcome.mdx?raw");
      content = module.default;
    } else if (slug.includes("uptime-kuma")) {
      const module = await import("../mdx/content/uptime-kuma.mdx?raw");
      content = module.default;
    } else if (slug.includes("awesome-terminal")) {
      const module = await import("../mdx/content/awesome-terminal.mdx?raw");
      content = module.default;
    } else if (slug.includes("writing-effect-inspired-by-apple")) {
      const module = await import(
        "../mdx/content/writing-effect-inspired-by-apple.mdx?raw"
      );
      content = module.default;
    } else if (slug.includes("example")) {
      const module = await import("../mdx/content/example.mdx?raw");
      content = module.default;
    } else {
      throw new Error(`Unsupported MDX file: ${slug}`);
    }

    // 检查返回的内容是否是有效的MDX内容
    if (!content || content.trim() === "") {
      throw new Error("Invalid MDX content received");
    }

    return content;
  } catch (error) {
    console.error("Error loading MDX file:", error);
    throw error;
  }
};

// 从后端加载MDX内容
export const loadMDXFromBackend = async (id: string): Promise<string> => {
  try {
    const res = await request.get(`http://localhost:3001/articles/detail/${id}`);
    if (!res.data.data.content) throw new Error("No content received");
    return res.data.data.content;
  } catch (error) {
    console.error("Error fetching MDX from backend:", error);
    throw error;
  }
};

// 使用插件解析frontmatter
export const parseFrontmatter = (content: string) => {
  const { attributes, body } = fm(content);
  return {
    frontmatter: attributes,
    content: body,
  }
}

// export const parseFrontmatter = (content: string) => {
//   const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
//   const match = content.match(frontmatterRegex);

//   if (!match) {
//     return {
//       frontmatter: {},
//       content: content,
//     };
//   }

//   const [, frontmatterStr, mdxContent] = match;
//   const frontmatter: Record<string, any> = {};

//   // 简单解析YAML frontmatter
//   frontmatterStr.split("\n").forEach((line) => {
//     const colonIndex = line.indexOf(":");
//     if (colonIndex > 0) {
//       const key = line.substring(0, colonIndex).trim();
//       const value = line.substring(colonIndex + 1).trim();
//       frontmatter[key] = value;
//     }
//   });

//   return {
//     frontmatter,
//     content: mdxContent,
//   };
// };

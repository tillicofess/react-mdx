import type { ComponentType } from "react";

interface CachedMDXContent {
    content: string;
    frontmatter: Record<string, any>;
}

const mdxContentCache = new Map<string, CachedMDXContent>();
const mdxComponentCache = new Map<string, ComponentType>();

export const getCachedMDX = (slug: string) => mdxContentCache.get(slug);
export const setCachedMDX = (slug: string, data: CachedMDXContent) => {
    mdxContentCache.set(slug, data);
};

export const getCachedMDXComponent = (slug: string) =>
    mdxComponentCache.get(slug);

export const setCachedMDXComponent = (slug: string, comp: ComponentType) =>
    mdxComponentCache.set(slug, comp);

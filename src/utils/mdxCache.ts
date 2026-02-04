import type { ComponentType } from "react";

interface CachedMDXContent {
    content: string;
    frontmatter: Record<string, any>;
}

const mdxContentCache = new Map<string, CachedMDXContent>();
const mdxComponentCache = new Map<string, ComponentType>();

export const getCachedMDX = (id: string) => mdxContentCache.get(id);
export const setCachedMDX = (id: string, data: CachedMDXContent) => {
    mdxContentCache.set(id, data);
};

export const getCachedMDXComponent = (id: string) =>
    mdxComponentCache.get(id);

export const setCachedMDXComponent = (id: string, comp: ComponentType) =>
    mdxComponentCache.set(id, comp);

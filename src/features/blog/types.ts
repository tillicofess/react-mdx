export type BlogLinkType = {
    title: string;
    image?: string;
    createdAt: string;
  };
  
  export type BlogType = {
    metadata: BlogLinkType;
    slug: string;
  };
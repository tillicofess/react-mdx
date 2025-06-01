export type BlogLinkType = {
    title: string;
    image?: string;
  };
  
  export type BlogType = {
    metadata: BlogLinkType;
    slug: string;
  };
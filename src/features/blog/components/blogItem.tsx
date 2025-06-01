import { type BlogType } from "../types";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
export default function BlogItemLink({ blog }: { blog: BlogType }) {
  return (
    <Link
      className={cn(
        "group/blog flex flex-col gap-2 p-2",
        "max-sm:screen-line-before max-sm:screen-line-after",
        "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after"
      )}
      to={`/blog/${blog.slug}`}
    >
      {blog.metadata.image && (
        <div className="relative select-none [&_img]:aspect-[1200/630] [&_img]:rounded-xl">
          <img
            src={blog.metadata.image}
            alt={blog.metadata.title}
            width={1200}
            height={630}
          />

          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />
        </div>
      )}

      <div className="flex flex-col gap-1 p-2">
        <h3 className="font-mono text-sm leading-snug font-medium text-balance underline-offset-4 group-hover/post:underline">
          {blog.metadata.title}
        </h3>
      </div>
    </Link>
  );
}

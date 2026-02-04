import Panel, { PanelHeader, PanelTitle } from "@/features/profile/components/panel";
import BlogItemLink from "./blogItem";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";
import useSWR from "swr";
import { fetcher } from '@/lib/axios';

export default function Blog() {
  const { data: allBlogs = [] } = useSWR('/articles/latest', fetcher);
  console.log(allBlogs);
  return (
    <Panel id="blog" className="scroll-mt-[1rem]">
      <PanelHeader>
        <PanelTitle>Blog</PanelTitle>
      </PanelHeader>

      <div className="relative py-4">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-grid"></div>
          <div className="border-l border-grid"></div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {allBlogs.map((v: any) => {
            return <BlogItemLink key={v.id} blog={v} />;
          })}
        </div>
      </div>

      <div className="screen-line-before flex justify-center">
        <Button asChild>
          <Link to="/blog">
            <span>All</span>
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </Panel>
  );
}

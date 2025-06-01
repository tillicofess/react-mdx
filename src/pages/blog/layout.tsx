import { Outlet } from "react-router";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

function DetailLayout() {
  return (
    <div className="max-w-screen overflow-x-hidden">
      <div className="mx-auto px-4 md:max-w-3xl">
        <div className="relative mt-2 border-x border-grid">
          <div
            className={cn(
              "screen-line-before screen-line-after flex items-start justify-between",
              "bg-zinc-950/0.75 bg-[image:radial-gradient(var(--pattern-foreground)_1px,_transparent_0)] bg-[size:8px_8px] [--pattern-foreground:var(--color-zinc-950)]/5 sm:bg-[size:10px_10px] dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5"
            )}
          >
            <Link to="/">
              <img src="/vite.svg" className="h-16"></img>
            </Link>
          </div>

          <div
            className={cn(
              "h-12 px-2",
              "screen-line-after",
              "before:absolute before:-left-[100vw] before:-z-1 before:h-full before:w-[200vw]",
              "before:bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:[--pattern-foreground:var(--color-black)]/5 dark:before:[--pattern-foreground:var(--color-white)]/5"
            )}
          />

          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DetailLayout;

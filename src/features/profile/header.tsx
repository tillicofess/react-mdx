import { AppleHelloEnglishEffect } from "@/registry/examples/apple-hello-effect";
import { cn } from "@/lib/utils";
import { Nav } from "./components/nav";
import NavItemLogin from "./components/nav-item-login";
import { USER } from "./data/user";
// import { FlipSentences } from "./flipSentences/flipSentences";

export default function Header() {
  return (
    <header className="relative mt-2">
      <div
        className={cn(
          "aspect-[2/1] border-x border-grid select-none",
          "screen-line-before screen-line-after after:-bottom-px",
          "bg-zinc-950/0.75 bg-[image:radial-gradient(var(--pattern-foreground)_1px,_transparent_0)] bg-[size:8px_8px] [--pattern-foreground:var(--color-zinc-950)]/5 sm:bg-[size:10px_10px] dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5"
        )}
      >
        <div className="flex size-full justify-center flex-col gap-6">
          <AppleHelloEnglishEffect />
        </div>
      </div>

      <div className="absolute top-0 right-0 flex items-center gap-3 border-grid bg-background ring ring-grid ring-inset sm:pl-3">
        <Nav className="max-sm:hidden" />

        <div className="flex items-center gap-2">
          <NavItemLogin />
        </div>
      </div>

      <div className="screen-line-after flex border-x border-grid">
        <div className="shrink-0 border-r border-grid">
          <img
            src={USER.photoURL}
            className="size-32 rounded-full ring-1 ring-border ring-offset-2 ring-offset-background sm:size-40"
          ></img>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex grow items-end mask-r-from-60% pb-1 pl-4">
            <div className="line-clamp-1 font-mono text-xs text-zinc-300 select-none dark:text-zinc-800">
              {"text-3xl "}
              <span className="inline dark:hidden">text-zinc-950</span>
              <span className="hidden dark:inline">text-zinc-50</span>
              {" font-medium"}
            </div>
          </div>

          <div className="border-t border-grid">
            <h1 className="flex items-center pl-4 font-heading text-2xl font-medium">
              {USER.displayName}
              &nbsp;
            </h1>
          </div>

          {/* <div className="h-12 border-t border-grid py-1 pl-4 sm:h-auto">
            <FlipSentences sentences={[...USER.flipSentences]} />
          </div> */}
        </div>
      </div>
    </header>
  );
}

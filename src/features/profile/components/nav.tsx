import { NAV_LINKS } from "../data/user";
import { cn } from "@/lib/utils";

export function Nav({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        "flex h-8 items-center gap-3 font-semibold text-sm text-muted-foreground",
        className
      )}
    >
      {NAV_LINKS.map(({ title, href }) => {
        return (
          <a key={href} href={href}>
            {title}
          </a>
        );
      })}
    </nav>
  );
}

import { SimpleTooltip } from "@/components/ui/tooltip";
import { TECH_STACK } from "../data/tech-stack";

export function TeckStackContent() {
  return (
    <div className="flex flex-wrap gap-4 select-none">
      {TECH_STACK.map((item) => {
        return (
          <SimpleTooltip key={item.key} content={item.title}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.title}
            >
              {item.theme ? (
                <>
                  <img
                    src={`/images/tech-stack-icons/${item.key}-light.svg`}
                    alt={`${item.title} light icon`}
                    width={32}
                    height={32}
                    className="[html.light_&]:block"
                  />
                  <img
                    src={`/images/tech-stack-icons/${item.key}-dark.svg`}
                    alt={`${item.title} dark icon`}
                    width={32}
                    height={32}
                    className="hidden [html.dark_&]:block"
                  />
                </>
              ) : (
                <img
                  src={`/images/tech-stack-icons/${item.key}.svg`}
                  alt={`${item.title} icon`}
                  width={32}
                  height={32}
                />
              )}
            </a>
          </SimpleTooltip>
        );
      })}
    </div>
  );
}

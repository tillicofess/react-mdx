import { Code } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export const components = {
  h1: (props: any) => (
    <h1 style={{ color: "#2563eb", marginBottom: "1rem" }} {...props} />
  ),
  h2: (props: any) => (
    <h2 style={{ color: "#1e40af", marginBottom: "0.75rem" }} {...props} />
  ),
  h3: (props: any) => (
    <h3 style={{ color: "#1e3a8a", marginBottom: "0.5rem" }} {...props} />
  ),
  p: (props: any) => (
    <p style={{ marginBottom: "1rem", lineHeight: "1.6" }} {...props} />
  ),
  a: (props: any) => (
    <a
      style={{ color: "#2563eb", textDecoration: "underline" }}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  figure({ className, ...props }: React.ComponentProps<"figure">) {
    const hasPrettyCode = "data-rehype-pretty-code-figure" in props;
    return (
      <figure
        className={cn(
          hasPrettyCode && "not-prose relative rehype-pretty-code",
          className
        )}
        {...props}
      />
    );
  },
  code: Code,
};

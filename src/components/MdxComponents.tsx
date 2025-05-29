import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Code } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export const components = {
  table: Table,
  thead: TableHeader,
  tbody: TableBody,
  tr: TableRow,
  th: TableHead,
  td: TableCell,
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
  pre({ ...props }) {
    return <pre {...props} />;
  },
  code: Code,
};

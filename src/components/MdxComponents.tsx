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
import { CopyButton } from "./copy-button";
import { CodeTabs } from "./code-tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlockCommand } from "./code-block-command";

import { type NpmCommands } from "@/types/unist";

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
  pre({
    __withMeta__,
    __rawString__,
    __pnpmCommand__,
    __yarnCommand__,
    __npmCommand__,
    __bunCommand__,
    ...props
  }: React.ComponentProps<"pre"> & {
    __withMeta__?: boolean;
    __rawString__?: string;
  } & NpmCommands) {
    console.log("props:", {
      __withMeta__,
      __rawString__,
      __pnpmCommand__,
      __yarnCommand__,
      __npmCommand__,
      __bunCommand__,
      ...props,
    });

    const isNpmCommand =
      __pnpmCommand__ && __yarnCommand__ && __npmCommand__ && __bunCommand__;

    if (isNpmCommand) {
      return (
        <CodeBlockCommand
          __pnpmCommand__={__pnpmCommand__}
          __yarnCommand__={__yarnCommand__}
          __npmCommand__={__npmCommand__}
          __bunCommand__={__bunCommand__}
        />
      );
    }
    return (
      <>
        <pre {...props} />

        {__rawString__ && (
          <CopyButton
            className={cn("absolute top-2 right-2", __withMeta__ && "top-9")}
            value={__rawString__}
          />
        )}
      </>
    );
  },
  code: Code,
  CodeTabs,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
};

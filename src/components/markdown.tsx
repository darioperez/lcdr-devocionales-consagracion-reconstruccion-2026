import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type El<T extends keyof React.JSX.IntrinsicElements> = (
  props: ComponentPropsWithoutRef<T>,
) => React.JSX.Element;

const components: {
  [K in
    | "h2"
    | "p"
    | "strong"
    | "em"
    | "ul"
    | "li"
    | "a"
    | "blockquote"]: El<K>;
} = {
  h2: ({ children }) => (
    <h2 className="mt-10 mb-3 flex items-center gap-3 font-display text-xl font-semibold tracking-tight">
      <span className="h-5 w-1 rounded-full bg-clay" aria-hidden="true" />
      {children}
    </h2>
  ),
  p: ({ children }) => (
    <p className="mb-5 text-[1.05rem] leading-[1.85] text-ink/90">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="mb-5 list-disc space-y-2 pl-6 text-ink/90">{children}</ul>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: (props) => (
    <a className="font-medium text-clay underline underline-offset-4" {...props} />
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-5 border-l-2 border-clay pl-4 text-ink/70 italic">
      {children}
    </blockquote>
  ),
};

export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}

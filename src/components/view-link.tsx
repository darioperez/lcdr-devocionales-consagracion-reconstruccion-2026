"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { flushSync } from "react-dom";

interface ViewLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> {
  href: string;
  nav?: "next" | "back";
  children: ReactNode;
}

export default function ViewLink({
  href,
  nav,
  children,
  ...rest
}: ViewLinkProps) {
  const router = useRouter();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      typeof document.startViewTransition !== "function"
    ) {
      return;
    }
    e.preventDefault();
    document.documentElement.dataset.nav = nav ?? "";
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        router.push(href);
      });
    });
    transition.finished.finally(() => {
      delete document.documentElement.dataset.nav;
    });
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}

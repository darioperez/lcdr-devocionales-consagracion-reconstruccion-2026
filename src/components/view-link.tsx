"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { flushSync } from "react-dom";
import { getNavDirection } from "@/lib/navigation";

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
  const pathname = usePathname();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    if (typeof document.startViewTransition !== "function") {
      return;
    }
    e.preventDefault();
    const direction = nav ?? getNavDirection(pathname, href);
    document.documentElement.dataset.nav = direction;
    let transition: ReturnType<typeof document.startViewTransition> | undefined;
    try {
      transition = document.startViewTransition(() => {
        flushSync(() => {
          router.push(href);
        });
      });
    } catch {
      router.push(href);
    }
    transition?.finished.finally(() => {
      delete document.documentElement.dataset.nav;
    });
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}

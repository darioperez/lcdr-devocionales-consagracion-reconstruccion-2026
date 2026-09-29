"use client";

import { usePathname } from "next/navigation";
import ViewLink from "@/components/view-link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function NavLink({ href, children, className = "" }: NavLinkProps) {
  const pathname = usePathname();

  const isActive =
    href === "/" ? pathname === "/" : (pathname ?? "").startsWith(href);

  return (
    <ViewLink
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`rounded-full px-2.5 py-1.5 text-smoke transition-colors hover:bg-cream hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay ${
        isActive ? "text-ink" : ""
      } sm:px-3 ${className}`}
    >
      {children}
    </ViewLink>
  );
}

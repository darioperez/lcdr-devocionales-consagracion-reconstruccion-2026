"use client";

import ViewLink from "@/components/view-link";
import { ArrowRightIcon } from "@/components/icons";
import { trackEvent } from "@/lib/umami";

interface CtaButtonProps {
  href: string;
  fase: string;
  label: string;
}

export default function CtaButton({ href, fase, label }: CtaButtonProps) {
  return (
    <ViewLink
      href={href}
      onNav={() => trackEvent("cta_click", { fase, destino: href })}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-clay px-6 text-base font-semibold whitespace-normal text-center text-paper transition-colors hover:bg-clay-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay sm:w-auto"
    >
      {label}
      <ArrowRightIcon className="h-4 w-4 shrink-0" />
    </ViewLink>
  );
}

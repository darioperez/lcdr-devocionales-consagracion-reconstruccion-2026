export type NavDirection = "next" | "back";

function pathDepth(p: string): number {
  if (p === "/") return 0;
  if (/^\/dias\/\d+$/.test(p)) return 2;
  return 1;
}

export function getNavDirection(
  current: string,
  target: string,
): NavDirection {
  const cur = current.replace(/\/+$/, "") || "/";
  const tgt = target.replace(/\/+$/, "") || "/";
  if (cur === tgt) return "next";

  const curDay = /^\/dias\/(\d+)$/.exec(cur);
  const tgtDay = /^\/dias\/(\d+)$/.exec(tgt);
  if (curDay && tgtDay) {
    return Number(tgtDay[1]) >= Number(curDay[1]) ? "next" : "back";
  }

  return pathDepth(tgt) >= pathDepth(cur) ? "next" : "back";
}

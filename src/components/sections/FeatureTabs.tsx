"use client";

import { type ComponentProps, useState } from "react";
import { usePaging } from "../paging/FullPage";
import { Tabs } from "../ui/Tabs";

type Props = Omit<ComponentProps<typeof Tabs>, "autoAdvanceMs"> & { rail: number; autoAdvanceMs: number };

/**
 * Tabs that restart every time their section becomes the current page:
 * remounting (via `key`) on arrival resets the selection to the first tab, so the
 * section's intro → first-panel entrance plays in order on each visit, and
 * auto-advance only runs while the section is on screen.
 */
export function FeatureTabs({ rail, autoAdvanceMs, ...rest }: Props) {
  const paging = usePaging();
  const onScreen = !paging.enabled || paging.rail === rail;

  // Count arrivals (React's "adjust state while rendering" pattern) and remount
  // only on arrival — not on leave, where a reset would show during the fade-out.
  const [visit, setVisit] = useState(0);
  const [wasOnScreen, setWasOnScreen] = useState(onScreen);
  if (onScreen !== wasOnScreen) {
    setWasOnScreen(onScreen);
    if (onScreen) setVisit((v) => v + 1);
  }

  return <Tabs key={visit} autoAdvanceMs={onScreen ? autoAdvanceMs : undefined} {...rest} />;
}

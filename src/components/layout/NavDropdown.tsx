"use client";

import { type PointerEvent, useId, useRef, useState } from "react";
import type { NavLink } from "@/data/navigation";
import { useDismiss } from "@/hooks/useDismiss";
import { Icon } from "../ui/Icon";
import styles from "./NavDropdown.module.css";

type Props = { label: string; items: NavLink[] };

/** Disclosure-style menu: click to toggle, Escape/outside click to close. */
export function NavDropdown({ label, items }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // A mouse user's hover already opened the menu; the click that follows
  // should not immediately close it again.
  const openedByHover = useRef(false);

  useDismiss(rootRef, open, (reason) => {
    setOpen(false);
    if (reason === "escape") triggerRef.current?.focus();
  });

  const onPointerEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || open) return;
    openedByHover.current = true;
    setOpen(true);
  };

  const onPointerLeave = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    openedByHover.current = false;
    setOpen(false);
  };

  const onClick = () => {
    if (openedByHover.current) {
      openedByHover.current = false;
      return;
    }
    setOpen((v) => !v);
  };

  return (
    <div ref={rootRef} className={styles.root} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={onClick}
      >
        {label}
        <Icon name="chevronDown" size={16} className={styles.chevron} />
      </button>
      <ul id={menuId} role="menu" className={styles.menu} hidden={!open}>
        {items.map((item) => (
          <li key={item.label} role="none">
            <a role="menuitem" href={item.href} className={styles.item} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

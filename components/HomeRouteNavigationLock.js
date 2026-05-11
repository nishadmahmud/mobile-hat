"use client";

import { useEffect } from "react";
import { useHomeNavigationLock } from "../context/HomeNavigationLockContext";

function normalizePathname(pathname) {
  if (!pathname || pathname === "") return "/";
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  return trimmed === "" ? "/" : trimmed;
}

export default function HomeRouteNavigationLock() {
  const { isLocked } = useHomeNavigationLock();

  useEffect(() => {
    if (!isLocked || typeof document === "undefined") return;

    const handler = (event) => {
      if (event.defaultPrevented) return;
      const target = event.target;
      if (!target || typeof target.closest !== "function") return;

      const anchor = target.closest("a[href]");
      if (!anchor) return;

      const raw = anchor.getAttribute("href");
      if (raw == null || raw === "") return;

      const trimmed = raw.trim();
      if (/^(mailto:|tel:|#)/i.test(trimmed)) return;

      let url;
      try {
        url = new URL(trimmed, window.location.origin);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const path = normalizePathname(url.pathname);
      if (path === "/") return;

      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener("click", handler, { capture: true });
    return () => {
      document.removeEventListener("click", handler, { capture: true });
    };
  }, [isLocked]);

  return null;
}

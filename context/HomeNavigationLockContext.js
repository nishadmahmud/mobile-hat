"use client";

import { createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";

const HomeNavigationLockContext = createContext({ isLocked: false });

const lockEnabled =
  process.env.NEXT_PUBLIC_HOME_NAV_LOCK === "true" ||
  process.env.NEXT_PUBLIC_HOME_NAV_LOCK === "1";

export function HomeNavigationLockProvider({ children }) {
  const pathname = usePathname();
  const isLocked = lockEnabled && pathname === "/";
  const value = useMemo(() => ({ isLocked }), [isLocked]);

  return (
    <HomeNavigationLockContext.Provider value={value}>
      {children}
    </HomeNavigationLockContext.Provider>
  );
}

export function useHomeNavigationLock() {
  return useContext(HomeNavigationLockContext);
}

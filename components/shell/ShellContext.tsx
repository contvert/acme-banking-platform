'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface ShellState {
  navOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
  toggleNav: () => void;
}

const Ctx = createContext<ShellState>({
  navOpen: false,
  openNav: () => {},
  closeNav: () => {},
  toggleNav: () => {},
});

export const useShell = () => useContext(Ctx);

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();

  const closeNav = useCallback(() => setNavOpen(false), []);
  const openNav = useCallback(() => setNavOpen(true), []);
  const toggleNav = useCallback(() => setNavOpen((v) => !v), []);

  // Navigating is the most common way to dismiss the drawer.
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  // While the drawer is open it owns the screen: lock the page behind it and
  // let Escape close it.
  useEffect(() => {
    if (!navOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [navOpen]);

  return (
    <Ctx.Provider value={{ navOpen, openNav, closeNav, toggleNav }}>{children}</Ctx.Provider>
  );
}

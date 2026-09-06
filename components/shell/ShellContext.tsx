'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface ShellState {
  navOpen: boolean;
  openNav: () => void;
  closeNav: () => void;
  toggleNav: () => void;
  /** Privacy mode: hides monetary amounts across the app. */
  privateMode: boolean;
  togglePrivate: () => void;
}

const Ctx = createContext<ShellState>({
  navOpen: false,
  openNav: () => {},
  closeNav: () => {},
  toggleNav: () => {},
  privateMode: false,
  togglePrivate: () => {},
});

const PRIVATE_KEY = 'mercury.privateMode';

export const useShell = () => useContext(Ctx);

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);
  const pathname = usePathname();

  const closeNav = useCallback(() => setNavOpen(false), []);
  const openNav = useCallback(() => setNavOpen(true), []);
  const toggleNav = useCallback(() => setNavOpen((v) => !v), []);
  const togglePrivate = useCallback(() => setPrivateMode((v) => !v), []);

  // Restore the saved preference once, on mount.
  useEffect(() => {
    try {
      if (localStorage.getItem(PRIVATE_KEY) === '1') setPrivateMode(true);
    } catch {
      /* storage may be unavailable; default to visible */
    }
  }, []);

  // Persist the choice and reflect it on <body> so a single CSS rule can hide
  // every monetary amount at once.
  useEffect(() => {
    try {
      localStorage.setItem(PRIVATE_KEY, privateMode ? '1' : '0');
    } catch {
      /* ignore */
    }
    document.body.dataset.private = privateMode ? 'true' : 'false';
    return () => {
      delete document.body.dataset.private;
    };
  }, [privateMode]);

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
    <Ctx.Provider value={{ navOpen, openNav, closeNav, toggleNav, privateMode, togglePrivate }}>{children}</Ctx.Provider>
  );
}

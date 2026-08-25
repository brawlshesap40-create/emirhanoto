"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "emirhanoto:favorites";
const EVENT_NAME = "emirhanoto:favorites-changed";

function parseIds(raw: string): number[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "number") : [];
  } catch {
    return [];
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function getServerSnapshot() {
  return "[]";
}

function writeFavorites(ids: number[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function useFavorites() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ids = useMemo(() => parseIds(raw), [raw]);

  const isFavorite = useCallback((id: number) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id: number) => {
      const next = ids.includes(id) ? ids.filter((existing) => existing !== id) : [...ids, id];
      writeFavorites(next);
    },
    [ids]
  );

  return { ids, isFavorite, toggle };
}

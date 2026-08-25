"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "emirhanoto:compare";
const EVENT_NAME = "emirhanoto:compare-changed";
const MAX_COMPARE = 3;

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

function writeCompare(ids: number[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function useCompare() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ids = useMemo(() => parseIds(raw), [raw]);

  const isSelected = useCallback((id: number) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id: number) => {
      if (ids.includes(id)) {
        writeCompare(ids.filter((existing) => existing !== id));
        return;
      }
      if (ids.length >= MAX_COMPARE) return;
      writeCompare([...ids, id]);
    },
    [ids]
  );

  const clear = useCallback(() => writeCompare([]), []);

  return { ids, isSelected, toggle, clear, max: MAX_COMPARE };
}

"use client";

import type { CorporateMemoryItem } from "./types.ts";

const memoryStorageKey = "corporate-brain-memory-v1";
const memoryChangeEvent = "corporate-brain-memory-change";
const emptyMemorySnapshot = "[]";

export function subscribeToMemory(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(memoryChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(memoryChangeEvent, onStoreChange);
  };
}

export function getMemorySnapshot(): string {
  return window.localStorage.getItem(memoryStorageKey) ?? emptyMemorySnapshot;
}

export function getServerMemorySnapshot(): string {
  return emptyMemorySnapshot;
}

export function parseMemorySnapshot(
  snapshot: string,
): readonly CorporateMemoryItem[] {
  try {
    const value: unknown = JSON.parse(snapshot);
    return Array.isArray(value) ? (value as CorporateMemoryItem[]) : [];
  } catch {
    return [];
  }
}

export function saveMemoryItem(item: CorporateMemoryItem): void {
  const current = parseMemorySnapshot(getMemorySnapshot());
  const next = [item, ...current.filter((candidate) => candidate.id !== item.id)];
  window.localStorage.setItem(memoryStorageKey, JSON.stringify(next));
  window.dispatchEvent(new Event(memoryChangeEvent));
}

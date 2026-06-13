import { useCallback, useRef, type KeyboardEvent } from 'react';

/**
 * Keyboard navigation for a horizontal tablist (ARIA APG pattern).
 * Arrow Left/Right move focus; Home/End jump to first/last.
 */
export function useTabList<T extends string>(
  tabs: readonly T[],
  active: T,
  setActive: (id: T) => void,
) {
  const listRef = useRef<HTMLDivElement>(null);

  const focusTab = useCallback(
    (id: T) => {
      setActive(id);
      requestAnimationFrame(() => {
        listRef.current
          ?.querySelector<HTMLButtonElement>(`[data-tabid="${id}"]`)
          ?.focus();
      });
    },
    [setActive],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent, currentId: T) => {
      const idx = tabs.indexOf(currentId);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusTab(tabs[(idx + 1) % tabs.length]);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusTab(tabs[(idx - 1 + tabs.length) % tabs.length]);
      } else if (e.key === 'Home') {
        e.preventDefault();
        focusTab(tabs[0]);
      } else if (e.key === 'End') {
        e.preventDefault();
        focusTab(tabs[tabs.length - 1]);
      }
    },
    [tabs, focusTab],
  );

  const getTabProps = (id: T) => ({
    role: 'tab' as const,
    'aria-selected': active === id,
    'aria-controls': `tabpanel-${id}`,
    id: `tab-${id}`,
    'data-tabid': id,
    tabIndex: active === id ? 0 : -1,
    onKeyDown: (e: KeyboardEvent) => onKeyDown(e, id),
  });

  const getPanelProps = (id: T) => ({
    role: 'tabpanel' as const,
    id: `tabpanel-${id}`,
    'aria-labelledby': `tab-${id}`,
  });

  return { listRef, getTabProps, getPanelProps };
}

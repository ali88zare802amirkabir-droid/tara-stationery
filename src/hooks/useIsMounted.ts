'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true only after the client has mounted. Use it to gate UI that
 * depends on persisted state so the server markup and first client render match.
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
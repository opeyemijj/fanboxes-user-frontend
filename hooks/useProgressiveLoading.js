"use client";

import { useState, useEffect } from "react";

export function useProgressiveLoading(sections = [], baseDelay = 500) {
  const [loadingStates, setLoadingStates] = useState(
    sections.reduce((acc, section) => ({ ...acc, [section]: true }), {})
  );

  useEffect(() => {
    const timeouts = sections.map((section, index) => {
      const delay = baseDelay + index * 300;
      return setTimeout(() => {
        setLoadingStates((prev) => ({ ...prev, [section]: false }));
      }, delay);
    });

    return () => timeouts.forEach(clearTimeout); // cleanup on unmount
  }, []); // << keep empty if sections are static

  const isLoading = (section) => loadingStates[section] || false;
  const isAnyLoading = () => Object.values(loadingStates).some(Boolean);

  return { isLoading, isAnyLoading, loadingStates };
}

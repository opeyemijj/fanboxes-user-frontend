// hooks/useDisableScrollInGameState.js
import { useEffect, useRef } from "react";

export function useDisableScrollInGameState(disabled) {
  const originalOverflowRef = useRef(null);

  useEffect(() => {
    // Capture original value only on first run
    if (originalOverflowRef.current === null) {
      originalOverflowRef.current = document.body.style.overflow || "auto";
    }

    if (disabled) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflowRef.current;
    }

    return () => {
      document.body.style.overflow = originalOverflowRef.current;
    };
  }, [disabled]);
}

"use client";
import { useEffect } from "react";

export default function ClientEventProvider() {
  useEffect(() => {
    // ❌ Disable right click
    const disableContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", disableContextMenu);

    // ❌ Block keyboard shortcuts for DevTools / Inspect
    const disableInspectShortcuts = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }

      // Ctrl+Shift+I / Cmd+Option+I
      if ((e.ctrlKey && e.shiftKey && e.key === "I") || (e.metaKey && e.altKey && e.key === "I")) {
        e.preventDefault();
      }

      // Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey && e.key.toLowerCase() === "u") || (e.metaKey && e.key.toLowerCase() === "u")) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", disableInspectShortcuts);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keydown", disableInspectShortcuts);
    };
  }, []);

  return null;
}

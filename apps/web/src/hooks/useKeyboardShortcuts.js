
import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcutMap) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if the key is an F-key (F1-F12)
      const isFKey = e.key.match(/^F([1-9]|1[0-2])$/);
      
      if (isFKey) {
        e.preventDefault(); // Prevent default browser behavior for F-keys (like F5 refresh, F1 help)
      }

      const handler = shortcutMap[e.key];
      if (handler) {
        // Only prevent default if we actually have a handler, except for F-keys which are always prevented above
        if (!isFKey && e.key !== 'Escape') {
          e.preventDefault();
        }
        handler(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcutMap]);
};

export default useKeyboardShortcuts;

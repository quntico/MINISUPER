
import { useEffect, useRef, useCallback } from 'react';

export const useBarcodeScanner = (onScan, options = {}) => {
  const {
    minLength = 8,
    timeout = 100,
    preventDefault = true
  } = options;

  const bufferRef = useRef('');
  const timeoutRef = useRef(null);

  const resetBuffer = useCallback(() => {
    bufferRef.current = '';
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' && e.target.type !== 'text') {
        return;
      }

      if (preventDefault && e.key !== 'Tab') {
        e.preventDefault();
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (e.key === 'Enter') {
        if (bufferRef.current.length >= minLength) {
          onScan(bufferRef.current);
        }
        resetBuffer();
        return;
      }

      if (e.key.length === 1) {
        bufferRef.current += e.key;
      }

      timeoutRef.current = setTimeout(() => {
        resetBuffer();
      }, timeout);
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onScan, minLength, timeout, preventDefault, resetBuffer]);

  return { resetBuffer };
};

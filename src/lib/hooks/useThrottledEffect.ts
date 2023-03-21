import { EffectCallback, useEffect, useRef } from 'react';

/**
 * Throttles an effect to only run once every `delay` milliseconds.
 *
 * @param {callback} callback to be called
 * @param {delay} delay in milliseconds
 * @param {deps} dependencies to watch for changes
 */
const useThrottledEffect = (
  callback: EffectCallback,
  delay: number,
  deps: any[] = []
): void => {
  const lastRan = useRef<number>(Date.now() - delay);

  useEffect(() => {
    const handler = setTimeout(function () {
      if (Date.now() - lastRan.current >= delay) {
        callback();
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [delay, ...deps]);
};

export { useThrottledEffect };

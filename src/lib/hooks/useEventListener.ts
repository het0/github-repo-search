import { useEffect } from 'react';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that gives
 * you the ability to add a callback function when an event is triggered on
 * an object.
 *
 * This function attaches an event listener to a target object on mount
 * and removes the listener on unmount.
 *
 * See [addEventListener()]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener}
 *
 * @kind function
 *
 * @param {EventTarget} target The [EventTarget]{@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget} to attach the listener to
 * @param {String} type The type of [Event]{@link https://developer.mozilla.org/en-US/docs/Web/Events} to listen for, e.g. 'resize', 'error', etc.
 * @param {Function} listener A callback function that is invoked when the event is triggered
 * @param  {Options} options An object that specifies characteristics about the event listener
 */
const useEventListener = <
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  T extends HTMLElement | MediaQueryList | void = void
>(
  target: EventTarget | undefined,
  type: KW | KH | KM,
  listener: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions | boolean
): void => {
  useEffect(() => {
    // in a Node environment, exit early
    if (!target || typeof target.addEventListener !== 'function') {
      return;
    }

    target.addEventListener(type, listener, options ?? {});

    // return a callback, which is called on unmount
    return () => target.removeEventListener(type, listener, options ?? {});
  }, [listener, options, target, type]);
};

export { useEventListener };

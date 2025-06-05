import { useEffect, useRef } from 'react';

/**
 * Custom hook for handling intersection observer
 * @param {(entries: IntersectionObserverEntry[]) => void} callback - Callback function to handle intersection
 * @param {Object} options - Intersection observer options
 * @param {number} [options.threshold=0] - Threshold for intersection
 * @param {string} [options.root=null] - Root element for intersection
 * @param {string} [options.rootMargin='0px'] - Root margin for intersection
 * @returns {React.RefObject} Reference to attach to the target element
 */
export const useIntersectionObserver = (
  callback,
  {
    threshold = 0,
    root = null,
    rootMargin = '0px'
  } = {}
) => {
  const targetRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (typeof callback === 'function') {
          callback(entries);
        }
      },
      {
        threshold,
        root,
        rootMargin
      }
    );

    // Observe target element
    const currentTarget = targetRef.current;
    if (currentTarget) {
      observerRef.current.observe(currentTarget);
    }

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, threshold, root, rootMargin]);

  return targetRef;
}; 
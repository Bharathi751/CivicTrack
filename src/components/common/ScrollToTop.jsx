import { useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Universal Scroll Restoration & Top Reset Component
 * Fixes the issue where navigating between pages (or going back to a previous page)
 * causes the page to open at the bottom or jump erratically.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const navigationType = useNavigationType();

  // 1. Disable browser's automatic scroll restoration on history navigation
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // 2. Reset scroll to top on every route/search change
  useLayoutEffect(() => {
    // If an explicit hash anchor exists (e.g. #section), try to scroll to it
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const scrollToTopImmediate = () => {
      // Reset window scroll
      window.scrollTo(0, 0);

      // Reset document element and body
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }

      // Reset any inner layout containers that might have scroll
      const scrollContainers = document.querySelectorAll(
        '.overflow-y-auto, [data-scroll-container], main'
      );
      scrollContainers.forEach((el) => {
        el.scrollTop = 0;
      });
    };

    // Immediate execution before repaint
    scrollToTopImmediate();

    // Additional raf + timeout to handle asynchronous content/images rendering
    const rafId = requestAnimationFrame(scrollToTopImmediate);
    const timerId = setTimeout(scrollToTopImmediate, 30);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [pathname, search, hash, navigationType]);

  return null;
}
